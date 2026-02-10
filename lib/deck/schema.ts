import { SchemaType } from "@google/generative-ai";
import type { ResponseSchema } from "@google/generative-ai";

/** JSON schema for one flashcard in the deck response */
const cardSchema = {
  type: SchemaType.OBJECT,
  description: "A single vocabulary flashcard",
  properties: {
    front: {
      type: SchemaType.STRING,
      description: "Front of the card (e.g. German word with article for nouns)",
    },
    back: {
      type: SchemaType.STRING,
      description: "Back of the card (translation or meaning)",
    },
    example: {
      type: SchemaType.STRING,
      description: "Example sentence using the word, slightly above A2 level",
    },
    imageDescription: {
      type: SchemaType.STRING,
      description: "Description for image generation; start with #IMAGE# and describe the scene",
    },
    type: {
      type: SchemaType.STRING,
      description:
        "Part of speech: noun masculine, noun feminine, noun neuter, verb, adjective, adverb, pronoun, preposition, conjunction, or interjection",
    },
  },
  required: ["front", "back", "example", "imageDescription", "type"],
} as const;

/**
 * Response schema for generateContent when responseMimeType is application/json.
 * Ensures the model returns { cards: GenerateDeckCard[] }.
 */
export const DECK_RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  description: "Generated Anki deck with a list of vocabulary cards",
  properties: {
    cards: {
      type: SchemaType.ARRAY,
      description: "List of flashcard objects",
      items: cardSchema,
    },
  },
  required: ["cards"],
};
