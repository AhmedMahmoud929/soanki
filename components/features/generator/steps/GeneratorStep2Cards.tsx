"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { GeneratorCard } from "../GeneratorCard";
import type { GeneratorCard as CardType } from "../types";
import type { GeneratorStep } from "../Stepper";

type GeneratorStep2CardsProps = {
  cards: CardType[];
  currentStep: GeneratorStep;
  onRemoveCard: (id: string) => void;
  onRegenerateImage: (card: CardType) => void;
  regeneratingImageCardId: string | null;
  onGenerateImages: () => void;
  isGeneratingImages: boolean;
  getImageSearchQuery: (card: CardType) => string;
  onAddCard: () => void;
  /** When on step 2, call this to go to Export step. */
  onGoToExport?: () => void;
};

const generateByAiButtonClass =
  "rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-bold px-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] disabled:opacity-60 inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)]";

export function GeneratorStep2Cards({
  cards,
  currentStep,
  onRemoveCard,
  onRegenerateImage,
  regeneratingImageCardId,
  onGenerateImages,
  isGeneratingImages,
  getImageSearchQuery,
  onAddCard,
  onGoToExport,
}: GeneratorStep2CardsProps) {
  const t = useTranslations("Generator");
  const isStep2 = currentStep === 2;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink/60 font-[family-name:var(--font-fredoka)]">
          {cards.length} {t("card.word")}(s)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={onGenerateImages}
            disabled={
              isGeneratingImages ||
              !cards.some((c) => !c.imageUrl && getImageSearchQuery(c) !== "")
            }
            className={generateByAiButtonClass}
          >
            <Icon icon="solar:magic-stick-3-bold" className="size-5" />
            {isGeneratingImages ? t("card.loading") : t("generateByAi.step2")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onAddCard}
            className="rounded-xl border-2 border-soft-blue/30 text-soft-blue-dark hover:bg-soft-blue/10 font-[family-name:var(--font-fredoka)]"
          >
            <Icon icon="solar:add-circle-bold" className="size-5" />
            {t("input.addCard")}
          </Button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <GeneratorCard
            key={card.id}
            card={card}
            step={currentStep}
            onRemove={cards.length > 1 ? onRemoveCard : undefined}
            onRegenerateImage={onRegenerateImage}
            isRegeneratingImage={regeneratingImageCardId === card.id}
          />
        ))}
      </div>
      {isStep2 && onGoToExport && (
        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            size={"lg"}
            onClick={onGoToExport}
            className="rounded-xl text-2xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-semibold px-8 py-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)]"
          >
            {t("nextToExport")}
          </Button>
        </div>
      )}
    </section>
  );
}
