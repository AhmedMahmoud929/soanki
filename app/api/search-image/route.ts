import { NextResponse } from "next/server";

const SERPER_BASE = "https://google.serper.dev/images";

export type SearchImageResponse = {
  imageUrl: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  return searchImage(q ?? "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const q = typeof body.q === "string" ? body.q.trim() : "";
    return searchImage(q);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Use { q: string }." },
      { status: 400 }
    );
  }
}

async function searchImage(q: string) {
  if (!q) {
    return NextResponse.json(
      { error: "Missing search query (query param 'q' or body.q)" },
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "SERPER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    q,
    num: "1",
    apiKey,
  });
  const hl = process.env.SERPER_HL;
  if (hl) params.set("hl", hl);

  const url = `${SERPER_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, { method: "GET", headers: {} });
    const data = (await res.json()) as {
      images?: Array<{ imageUrl?: string }>;
    };

    const imageUrl =
      Array.isArray(data.images) && data.images.length > 0
        ? data.images[0].imageUrl
        : null;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image found for this query" },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl } satisfies SearchImageResponse);
  } catch (err) {
    console.error("search-image API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Image search failed" },
      { status: 500 }
    );
  }
}
