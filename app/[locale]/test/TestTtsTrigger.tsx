"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE_TEXT = "Say cheerfully: Have a wonderful day!";

export function TestTtsTrigger() {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerTts = async () => {
    setStatus("loading");
    setErrorMessage(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLE_TEXT }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus("playing");
      const audio = new Audio(url);
      audio.onended = () => setStatus("idle");
      audio.onerror = () => {
        setStatus("error");
        setErrorMessage("Playback failed");
      };
      await audio.play();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "TTS failed");
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <p className="text-ink/70 text-sm">{SAMPLE_TEXT}</p>
      <Button onClick={triggerTts} disabled={status === "loading"}>
        {status === "loading" ? "Generating…" : "Trigger TTS"}
      </Button>
      {status === "error" && (
        <p className="text-red-600 text-sm" role="alert">
          {errorMessage}
        </p>
      )}
      {audioUrl && status !== "error" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink/60">Play again:</span>
          <audio src={audioUrl} controls className="max-w-full" />
        </div>
      )}
    </div>
  );
}
