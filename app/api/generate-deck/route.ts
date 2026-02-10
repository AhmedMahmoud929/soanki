import { NextResponse } from "next/server";
import { generateDeckWithGemini } from "@/lib/deck";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const words: string[] = Array.isArray(body.words)
      ? body.words
      : typeof body.input === "string"
        ? body.input
          .split(/[\n,]+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
        : [];

    if (words.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please provide a non-empty list of words (body.words or body.input)",
        },
        { status: 400 }
      );
    }

    const language =
      body.language === "en" || body.language === "ar" ? body.language : "de";
    const explainingLanguage =
      body.explainingLanguage === "de" || body.explainingLanguage === "ar"
        ? body.explainingLanguage
        : "en";
    const level =
      ["A1", "A2", "B1", "B2", "C1"].includes(body.level) ? body.level : "A2";

    const cards = await generateDeckWithGemini(words, {
      language,
      explainingLanguage,
      level,
    });
    return NextResponse.json({ cards });
  } catch (err) {
    console.error("generate-deck API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message === "GEMINI_API_KEY is not configured" ? 500 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
