import { GoogleGenerativeAI } from "@google/generative-ai";
import { DECK_RESPONSE_SCHEMA, ALTERNATE_EXAMPLE_RESPONSE_SCHEMA } from "./schema";
import { getDeckGenerationSystemPrompt, getAlternateExamplePrompt } from "./prompt";
import type { GenerateDeckCard } from "./types";

export type AlternateExampleResult = { example: string; imageDescription: string };

const DEFAULT_MODEL = process.env.GEMINI_API_MODEL ?? "gemini-1.5-flash";

export type GenerateDeckOptions = {
  apiKey?: string;
  model?: string;
  language?: "de" | "en" | "ar";
  explainingLanguage?: "de" | "en" | "ar";
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
};

/**
 * Call Gemini to generate deck cards for the given word list.
 * Uses structured output (responseSchema) so the model returns JSON.
 * @throws if API key is missing or Gemini returns no valid JSON
 */
export async function generateDeckWithGemini(
  words: string[],
  options?: GenerateDeckOptions
): Promise<GenerateDeckCard[]> {
  const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelId = options?.model ?? process.env.GEMINI_API_MODEL ?? DEFAULT_MODEL;
  const language = options?.language ?? "de";
  const explainingLanguage = options?.explainingLanguage ?? "en";
  const level = options?.level ?? "A2";
  const systemPrompt = getDeckGenerationSystemPrompt(language, level, explainingLanguage);
  const inputList = words.join(", ");
  const userPrompt = `Input: ${inputList}`;
  const fullPrompt = [systemPrompt, userPrompt].join("\n\n");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: DECK_RESPONSE_SCHEMA,
    },
  });
  const text = result.response.text();

  if (!text) {
    throw new Error("Gemini returned no text");
  }

  const parsed = JSON.parse(text) as { cards?: unknown[] };
  if (!Array.isArray(parsed?.cards)) {
    throw new Error("Gemini response missing or invalid 'cards' array");
  }

  return parsed.cards.map((c) => {
    const card = c as Record<string, unknown>;
    return {
      front: String(card.front ?? ""),
      back: String(card.back ?? ""),
      example: String(card.example ?? ""),
      imageDescription: String(card.imageDescription ?? ""),
      type: String(card.type ?? ""),
    } satisfies GenerateDeckCard;
  });
}

/**
 * Generate one alternate example sentence and image description for a word.
 * Used when image search fails so we can try a different, more visual example.
 */
export async function generateAlternateExampleWithGemini(
  word: string,
  options?: GenerateDeckOptions & { meaning?: string; currentExample?: string }
): Promise<AlternateExampleResult> {
  const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelId = options?.model ?? process.env.GEMINI_API_MODEL ?? DEFAULT_MODEL;
  const language = options?.language ?? "de";
  const explainingLanguage = options?.explainingLanguage ?? "en";
  const level = options?.level ?? "A2";
  const systemPrompt = getAlternateExamplePrompt(language, level, explainingLanguage);
  const context = [word, options?.meaning && `Meaning: ${options.meaning}`, options?.currentExample && `Current example (give a different one): ${options.currentExample}`]
    .filter(Boolean)
    .join("\n");
  const userPrompt = `Word:\n${context}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: [systemPrompt, userPrompt].join("\n\n") }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: ALTERNATE_EXAMPLE_RESPONSE_SCHEMA,
    },
  });
  const text = result.response.text();
  if (!text) {
    throw new Error("Gemini returned no text");
  }

  const parsed = JSON.parse(text) as Record<string, unknown>;
  const example = String(parsed?.example ?? "").trim();
  const imageDescription = String(parsed?.imageDescription ?? "").trim();
  if (!example || !imageDescription) {
    throw new Error("Gemini response missing example or imageDescription");
  }
  return { example, imageDescription };
}
