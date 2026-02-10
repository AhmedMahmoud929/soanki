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
