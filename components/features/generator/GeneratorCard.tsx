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
  /** Called when user clicks Regenerate to fetch an image from the card's imageDescription (or word). */
  onRegenerateImage?: (card: CardType) => void;
  /** True while the image for this card is being fetched. */
  isRegeneratingImage?: boolean;
};

export function GeneratorCard({
  card,
  step,
  onRemove,
  onRegenerateImage,
  isRegeneratingImage = false,
}: GeneratorCardProps) {
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
      {(step === 2 || step === 4) && (
        <div className="mt-4 rounded-xl bg-ink/5 border-2 border-dashed border-ink/20 aspect-video flex flex-col items-center justify-center gap-2 overflow-hidden relative">
          {card.imageUrl && !isRegeneratingImage ? (
            <img src={card.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <>
              {isRegeneratingImage ? (
                <span className="text-xs text-ink/60 font-[family-name:var(--font-fredoka)]">{t("loading")}</span>
              ) : (
                <>
                  <Icon icon="solar:gallery-bold" className="size-10 text-ink/30" />
                  <span className="text-xs text-ink/50 font-[family-name:var(--font-fredoka)]">{t("imagePlaceholder")}</span>
                </>
              )}
            </>
          )}
          {<div className={cn("flex gap-2 mt-1", card.imageUrl && "absolute bottom-4 left-1/2 -translate-x-1/2")}>
            <button
              type="button"
              disabled={
                !onRegenerateImage ||
                isRegeneratingImage ||
                (!(card.imageDescription?.trim()) && !card.word?.trim())
              }
              onClick={() => onRegenerateImage?.(card)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue",
                onRegenerateImage &&
                  !isRegeneratingImage &&
                  (!!card.imageDescription?.trim() || !!card.word?.trim())
                  ? "bg-soft-blue/20 text-soft-blue-dark hover:bg-soft-blue/30 cursor-pointer"
                  : "bg-ink/10 text-ink/40 cursor-not-allowed",
                card.imageUrl && "bg-soft-blue-dark text-white hover:bg-soft-blue-dark/90"
              )}
            >
              {isRegeneratingImage ? t("loading") : t("regenerate")}
            </button>
            <button
              type="button"
              className={cn("rounded-lg px-3 py-1.5 text-xs font-medium bg-soft-blue/20 text-soft-blue-dark hover:bg-soft-blue/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue", card.imageUrl && "bg-white text-soft-blue-dark hover:bg-soft-blue/10")}
            >
              {t("uploadImage")}
            </button>
          </div>}
        </div>
      )}

      {/* Audio placeholders (Step 3, 4) */}
      {(step === 4) && (
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-3 py-2">
            <button
              type="button"
              disabled={!card.frontAudioUrl}
              onClick={() => {
                if (card.frontAudioUrl) new Audio(card.frontAudioUrl).play();
              }}
              className="p-2 rounded-lg bg-white border border-ink/10 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              aria-label={t("play")}
            >
              <Icon icon="solar:play-circle-bold" className="size-5 text-soft-blue-dark" />
            </button>
            <span className="text-xs text-ink/60 font-[family-name:var(--font-fredoka)]">{t("frontAudio")}</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-3 py-2">
            <button
              type="button"
              disabled={!card.exampleAudioUrl}
              onClick={() => {
                if (card.exampleAudioUrl) new Audio(card.exampleAudioUrl).play();
              }}
              className="p-2 rounded-lg bg-white border border-ink/10 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
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
