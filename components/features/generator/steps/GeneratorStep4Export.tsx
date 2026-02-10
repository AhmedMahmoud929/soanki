"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

type GeneratorStep4ExportProps = {
  exportPreview: string;
  onPrepareDeck: () => void;
  isPreparingDeck: boolean;
  onExportDeck: () => void;
  hasCards: boolean;
};

/** Parse tab-separated export (no header row). */
function parseExportPreview(content: string): string[][] {
  const trimmed = content.trim();
  if (!trimmed) return [];
  const lines = trimmed.split(/\r?\n/);
  return lines.map((line) => line.split("\t")).filter((row) => row.some((cell) => cell.trim() !== ""));
}

const COLUMN_COUNT = 5; // Front, Back, Example, Image, Type

export function GeneratorStep4Export({
  exportPreview,
  onExportDeck,
  hasCards,
}: GeneratorStep4ExportProps) {
  const t = useTranslations("Generator");
  const rows = useMemo(() => parseExportPreview(exportPreview), [exportPreview]);

  return (
    <section className="mt-10 rounded-2xl border-2 border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-lg font-bold text-ink font-[family-name:var(--font-fredoka)] mb-4">
        {t("export.button")}
      </h2>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          onClick={onExportDeck}
          disabled={!hasCards}
          className="rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-bold px-6 py-3 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Icon icon="solar:download-bold" className="size-5" />
          {t("export.button")}
        </Button>
      </div>
      {!hasCards && (
        <p className="mt-2 text-sm text-ink/50 font-[family-name:var(--font-fredoka)]">
          {t("export.disabledHint")}
        </p>
      )}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink/70 font-[family-name:var(--font-fredoka)] mb-2">
          {t("export.csvPreview")}
        </h3>
        {rows.length > 0 ? (
          <div className="rounded-xl border-2 border-ink/10 bg-ink/5 overflow-auto max-h-80">
            <table className="w-full text-sm font-[family-name:var(--font-fredoka)] text-ink/90 border-collapse">
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-ink/10 last:border-b-0 hover:bg-ink/5 transition-colors"
                  >
                    {Array.from({ length: COLUMN_COUNT }, (_, ci) => (
                      <td
                        key={ci}
                        className="py-2.5 px-4 align-top max-w-48 truncate"
                        title={row[ci] ?? ""}
                      >
                        {row[ci] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border-2 border-ink/10 bg-ink/5 py-8 px-4 text-center text-ink/50 text-sm font-[family-name:var(--font-fredoka)]">
            — No data yet —
          </p>
        )}
      </div>
    </section>
  );
}
