"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GeneratorStep4ExportProps = {
  csvPreview: string;
  onPrepareDeck: () => void;
  isPreparingDeck: boolean;
};

const generateByAiButtonClass =
  "rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-bold px-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] disabled:opacity-60 inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)]";

export function GeneratorStep4Export({
  csvPreview,
  onPrepareDeck,
  isPreparingDeck,
}: GeneratorStep4ExportProps) {
  const t = useTranslations("Generator");

  return (
    <section className="mt-10 rounded-2xl border-2 border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-lg font-bold text-ink font-[family-name:var(--font-fredoka)] mb-4">
        {t("export.button")}
      </h2>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          onClick={onPrepareDeck}
          disabled={isPreparingDeck}
          className={generateByAiButtonClass}
        >
          <Icon icon="solar:magic-stick-3-bold" className="size-5" />
          {isPreparingDeck ? t("card.loading") : t("generateByAi.step4")}
        </Button>
        <Button
          disabled
          className="rounded-xl bg-soft-blue-dark text-white font-bold px-6 py-3 opacity-70 cursor-not-allowed"
        >
          {t("export.button")}
        </Button>
      </div>
      <p className="mt-2 text-sm text-ink/50 font-[family-name:var(--font-fredoka)]">
        {t("export.disabledHint")}
      </p>
      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink/70 font-[family-name:var(--font-fredoka)] mb-2">
          {t("export.csvPreview")}
        </h3>
        <pre
          className={cn(
            "rounded-xl border-2 border-ink/10 bg-ink/5 p-4 text-xs text-ink/80 overflow-auto max-h-48 font-mono whitespace-pre-wrap",
            "rtl:text-right"
          )}
        >
          {csvPreview || "— No data yet —"}
        </pre>
      </div>
    </section>
  );
}
