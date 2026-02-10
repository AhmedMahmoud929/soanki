"use client";

import { cn } from "@/lib/utils";

const cardBase =
  "rounded-2xl border-2 border-ink/10 bg-white p-5 shadow-[var(--shadow-card)]";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <article className={cn(cardBase, "relative", className)} aria-busy="true" aria-label="Loading card">
      {/* Word */}
      <div className="h-6 w-3/4 max-w-[12rem] rounded-md bg-ink/10 animate-pulse font-[family-name:var(--font-fredoka)]" />
      {/* Meaning label + line */}
      <div className="mt-2 flex items-baseline gap-2">
        <div className="h-4 w-14 shrink-0 rounded bg-ink/10 animate-pulse" />
        <div className="h-4 flex-1 max-w-[10rem] rounded bg-ink/10 animate-pulse" />
      </div>
      {/* Example label + line */}
      <div className="mt-1 flex items-baseline gap-2">
        <div className="h-4 w-12 shrink-0 rounded bg-ink/10 animate-pulse" />
        <div className="h-4 flex-1 max-w-[14rem] rounded bg-ink/10 animate-pulse" />
      </div>
      {/* Part of speech */}
      <div className="mt-1 h-3 w-24 rounded bg-ink/10 animate-pulse" />
    </article>
  );
}
