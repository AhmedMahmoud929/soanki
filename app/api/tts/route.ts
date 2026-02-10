import { NextResponse } from "next/server";
import { generateTts } from "@/lib/tts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const voiceName =
      typeof body.voiceName === "string" ? body.voiceName : undefined;

    if (!text) {
      return NextResponse.json(
        { error: "Missing or empty text (body.text required)" },
        { status: 400 }
      );
    }

    const wavBuffer = await generateTts({ text, voiceName });
    const bytes = new Uint8Array(wavBuffer);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(bytes.length),
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    const message = err instanceof Error ? err.message : "TTS failed";
    const status =
      message === "GEMINI_API_KEY is not configured" ? 500 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
