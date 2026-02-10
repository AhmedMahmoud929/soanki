import { GoogleGenerativeAI } from "@google/generative-ai";
import { DECK_RESPONSE_SCHEMA } from "./schema";
import { DECK_GENERATION_SYSTEM_PROMPT } from "./prompt";
import type { GenerateDeckCard } from "./types";

const DEFAULT_MODEL = process.env.GEMINI_API_MODEL ?? "gemini-1.5-flash";

/**
 * Call Gemini to generate deck cards for the given word list.
 * Uses structured output (responseSchema) so the model returns JSON.
 * @throws if API key is missing or Gemini returns no valid JSON
 */
export async function generateDeckWithGemini(
  words: string[],
  options?: { apiKey?: string; model?: string }
): Promise<GenerateDeckCard[]> {
  const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelId = options?.model ?? process.env.GEMINI_API_MODEL ?? DEFAULT_MODEL;
  const inputList = words.join(", ");
  const userPrompt = `Input: ${inputList}`;
  const fullPrompt = [DECK_GENERATION_SYSTEM_PROMPT, userPrompt].join("\n\n");

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
