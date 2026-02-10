import { GoogleGenAI } from "@google/genai";
import { pcmToWav } from "./pcm-to-wav";

const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const DEFAULT_VOICE = "Kore";

export type TtsOptions = {
  /** Text to speak. Can include style hints, e.g. "Say cheerfully: Hello!" */
  text: string;
  /** Prebuilt voice name (e.g. Kore, Puck, Charon). Default: Kore */
  voiceName?: string;
  apiKey?: string;
};

/**
 * Generate speech from text using Gemini TTS.
 * Returns a WAV file as a Buffer (16-bit PCM, 24kHz, mono, wrapped in WAV header).
 * @throws if API key is missing or the model returns no audio
 */
export async function generateTts(options: TtsOptions): Promise<Buffer> {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const text = options.text.trim();
  if (!text) {
    throw new Error("Text is required for TTS");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ role: "user", parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: options.voiceName ?? DEFAULT_VOICE,
          },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const inlineData = part?.inlineData;
  const base64Data = inlineData?.data;
  if (!base64Data) {
    throw new Error("Gemini TTS returned no audio");
  }

  const raw = Buffer.from(base64Data.replace(/\s/g, ""), "base64");
  const mimeType = (inlineData as { mimeType?: string } | undefined)?.mimeType ?? "";
  if (mimeType.toLowerCase().includes("wav")) {
    return raw;
  }
  return pcmToWav(raw, 1, 24000, 2);
}
