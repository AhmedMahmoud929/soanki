import { NextResponse } from "next/server";
import { generateDeckWithGemini } from "@/lib/deck";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const word =
      typeof body.word === "string" ? body.word.trim() : "";

    if (!word) {
      return NextResponse.json(
        { error: "Please provide a non-empty word (body.word)" },
        { status: 400 }
      );
    }

    const cards = await generateDeckWithGemini([word]);
    const card = cards[0];
    if (!card) {
      return NextResponse.json(
        { error: "No card generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ card });
  } catch (err) {
    console.error("create-card API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message === "GEMINI_API_KEY is not configured" ? 500 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
