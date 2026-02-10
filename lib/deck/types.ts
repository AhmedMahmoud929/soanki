/** One card as returned by the generate-deck API / Gemini */
export interface GenerateDeckCard {
  front: string;
  back: string;
  example: string;
  imageDescription: string;
  type: string;
}
