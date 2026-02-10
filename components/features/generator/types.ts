export interface GeneratorCard {
  id: string;
  word: string;
  meaning: string;
  example: string;
  partOfSpeech: string;
  /** Description for image generation (e.g. "#IMAGE# - ...") */
  imageDescription?: string | null;
  imageUrl?: string | null;
  frontAudioUrl?: string | null;
  exampleAudioUrl?: string | null;
  loading?: boolean;
}

export type GeneratorStep = 1 | 2 | 3 | 4;

/** Target language for generated deck (vocabulary language). */
export type GeneratorLanguage = "de" | "en" | "ar";

/** CEFR level for example sentences and complexity. */
export type GeneratorLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface GenerationOptions {
  language: GeneratorLanguage;
  level: GeneratorLevel;
}
