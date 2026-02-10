import { NextResponse } from "next/server";
import { generateAlternateExampleWithGemini } from "@/lib/deck";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const word = typeof body.word === "string" ? body.word.trim() : "";
    if (!word) {
      return NextResponse.json(
        { error: "Missing or empty word" },
        { status: 400 }
      );
    }

    const language =
      body.language === "en" || body.language === "ar" ? body.language : "de";
    const explainingLanguage =
      body.explainingLanguage === "de" || body.explainingLanguage === "ar"
        ? body.explainingLanguage
        : "en";
    const level = ["A1", "A2", "B1", "B2", "C1"].includes(body.level)
      ? body.level
      : "A2";

    const result = await generateAlternateExampleWithGemini(word, {
      language,
      explainingLanguage,
      level,
      meaning: typeof body.meaning === "string" ? body.meaning.trim() : undefined,
      currentExample:
        typeof body.currentExample === "string"
          ? body.currentExample.trim()
          : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("generate-example API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message === "GEMINI_API_KEY is not configured" ? 500 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
