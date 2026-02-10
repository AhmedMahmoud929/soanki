"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import type { GeneratorCard as CardType } from "./types";
import type { GeneratorStep } from "./Stepper";

type GeneratorCardProps = {
  card: CardType;
  step: GeneratorStep;
  onRemove?: (id: string) => void;
};

export function GeneratorCard({ card, step, onRemove }: GeneratorCardProps) {
  const t = useTranslations("Generator.card");

  const cardBase =
    "rounded-2xl border-2 border-ink/10 bg-white p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft-hover)] hover:border-soft-blue/30 focus-within:ring-2 focus-within:ring-soft-blue/30 focus-within:ring-offset-2";

  return (
    <article className={cn(cardBase, "relative")}>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(card.id)}
          className="absolute top-3 end-3 p-1.5 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue"
          aria-label="Remove card"
        >
          <Icon icon="solar:trash-bin-2-bold" className="size-5" />
        </button>
      )}

      {/* Word (bold) */}
      <p className="font-bold text-lg text-ink font-[family-name:var(--font-fredoka)] pr-8">
        {card.loading ? t("loading") : card.word || "—"}
      </p>

      {/* Meaning */}
      <p className="mt-2 text-sm text-ink/80 font-[family-name:var(--font-fredoka)]">
        <span className="text-ink/50 font-medium">{t("meaning")}: </span>
        {card.loading ? "…" : card.meaning || "—"}
      </p>

      {/* Example sentence */}
      <p className="mt-1 text-sm text-ink/70 italic font-[family-name:var(--font-fredoka)]">
        <span className="text-ink/50 not-italic font-medium">{t("example")}: </span>
        {card.loading ? "…" : card.example || "—"}
      </p>

      {/* Part of speech */}
      <p className="mt-1 text-xs text-ink/50 font-[family-name:var(--font-fredoka)]">
        {t("partOfSpeech")}: {card.loading ? "…" : card.partOfSpeech || "—"}
      </p>

      {/* Image placeholder (Step 2, 3, 4) */}
      {(step === 2 || step === 3 || step === 4) && (
        <div className="mt-4 rounded-xl bg-ink/5 border-2 border-dashed border-ink/20 aspect-video flex flex-col items-center justify-center gap-2">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <>
              <Icon icon="solar:gallery-bold" className="size-10 text-ink/30" />
              <span className="text-xs text-ink/50 font-[family-name:var(--font-fredoka)]">{t("imagePlaceholder")}</span>
              <div className="flex gap-2">
                {/* <button
                  type="button"
                  disabled
                  className="rounded-lg px-3 py-1.5 text-xs font-medium bg-ink/10 text-ink/40 cursor-not-allowed"
                >
                  {t("regenerate")}
                </button> */}
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium bg-soft-blue/20 text-soft-blue-dark hover:bg-soft-blue/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue"
                >
                  {t("uploadImage")}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Audio placeholders (Step 3, 4) */}
      {(step === 3 || step === 4) && (
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-3 py-2">
            <button
              type="button"
              className="p-2 rounded-lg bg-white border border-ink/10 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue"
              aria-label={t("play")}
            >
              <Icon icon="solar:play-circle-bold" className="size-5 text-soft-blue-dark" />
            </button>
            <span className="text-xs text-ink/60 font-[family-name:var(--font-fredoka)]">{t("frontAudio")}</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-3 py-2">
            <button
              type="button"
              className="p-2 rounded-lg bg-white border border-ink/10 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue"
              aria-label={t("play")}
            >
              <Icon icon="solar:play-circle-bold" className="size-5 text-soft-orange" />
            </button>
            <span className="text-xs text-ink/60 font-[family-name:var(--font-fredoka)]">{t("exampleAudio")}</span>
          </div>
        </div>
      )}
    </article>
  );
}
