export type DeckPromptLanguage = "de" | "en" | "ar";
export type DeckPromptLevel = "A1" | "A2" | "B1" | "B2" | "C1";

const LANGUAGE_NAMES: Record<DeckPromptLanguage, string> = {
  de: "German",
  en: "English",
  ar: "Arabic",
};

/**
 * Build system prompt for deck generation with optional language, explaining language, and CEFR level.
 * Defaults: German vocabulary, English explanations, A2.
 */
export function getDeckGenerationSystemPrompt(
  language: DeckPromptLanguage = "de",
  level: DeckPromptLevel = "A2",
  explainingLanguage: DeckPromptLanguage = "en"
): string {
  const langName = LANGUAGE_NAMES[language];
  const explainLangName = LANGUAGE_NAMES[explainingLanguage];
  const levelInstruction =
    level === "A1"
      ? "Use very simple vocabulary and short sentences (A1 level)."
      : level === "C1"
        ? "Use rich, nuanced vocabulary and complex sentences (C1 level)."
        : `Keep example sentences at ${level} level: natural, context-rich, and appropriate in complexity.`;

  const nounRules =
    language === "de"
      ? `
Nouns:
Always include the gender with the article (e.g., der, die, das) in the front.
The type field should be noun masculine, noun feminine, or noun neuter.
Always include articles for nouns.`
      : language === "ar"
        ? `
Nouns:
Include definite article (ال) where appropriate in the front when relevant.
The type field should be noun masculine or noun feminine.`
        : `
Nouns:
The type field should be noun (or noun masculine/feminine if the language distinguishes).`;

  return `I want you to generate a full Anki deck for my ${langName} vocabulary list. Respond with a JSON object containing a "cards" array. Each card must have: front, back, example, imageDescription, type (all strings). Follow these rules carefully:
${nounRules}

Other parts of speech:
Use verb, adjective, adverb, pronoun, preposition, conjunction, or interjection as the type when applicable.

Example sentences and level:
${levelInstruction}
The image description should clearly illustrate the example and emphasize the meaning. Start it with #IMAGE#.

Format:
- front: the word or phrase in ${langName} (with article for ${langName} nouns if applicable).
- back: translation or meaning in ${explainLangName} only.
- example: one example sentence at ${level} level (in ${langName}).
- imageDescription: #IMAGE# followed by a short scene description in ${explainLangName}.
- type: part of speech (e.g. noun masculine, verb, adjective); you may give the type label in ${explainLangName} if natural.

Output only valid JSON with a "cards" array; no extra notes or explanations.`;
}

/**
 * Build prompt for generating one alternate example + image description for a word.
 * Used when image search fails so we can try a different, more visual example.
 */
export function getAlternateExamplePrompt(
  language: DeckPromptLanguage = "de",
  level: DeckPromptLevel = "A2",
  explainingLanguage: DeckPromptLanguage = "en"
): string {
  const langName = LANGUAGE_NAMES[language];
  const explainLangName = LANGUAGE_NAMES[explainingLanguage];
  const levelInstruction =
    level === "A1"
      ? "Use very simple vocabulary and short sentences (A1 level)."
      : level === "C1"
        ? "Use rich, nuanced vocabulary and complex sentences (C1 level)."
        : `Keep the example at ${level} level.`;
  return `Generate ONE alternate example sentence and image description for the given word. The example must be different from any previous one and must describe a clear, easy-to-illustrate scene (so we can find an image for it). Use ${langName} for the example and ${explainLangName} for the image description.
${levelInstruction}
Rules:
- example: one example sentence in ${langName} that clearly evokes a visual scene.
- imageDescription: start with #IMAGE# then a short scene description in ${explainLangName} (something that would return good image search results).
Output only valid JSON with keys: example, imageDescription.`;
}

/** @deprecated Use getDeckGenerationSystemPrompt() for dynamic language/level. */
export const DECK_GENERATION_SYSTEM_PROMPT = getDeckGenerationSystemPrompt("de", "A2");
