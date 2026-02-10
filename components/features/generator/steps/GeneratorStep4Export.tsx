"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

type GeneratorStep4ExportProps = {
  csvPreview: string;
  onPrepareDeck: () => void;
  isPreparingDeck: boolean;
  onExportDeck: () => void;
  hasCards: boolean;
};

/** Parse a single CSV row (handles quoted fields with commas). */
function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

function csvToTableData(csv: string): { headers: string[]; rows: string[][] } {
  const trimmed = csv.trim();
  if (!trimmed) return { headers: [], rows: [] };
  const lines = trimmed.split(/\r?\n/);
  const rows = lines.map(parseCSVRow);
  const headers = rows[0] ?? [];
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  return { headers, rows: dataRows };
}

export function GeneratorStep4Export({
  csvPreview,
  onExportDeck,
  hasCards,
}: GeneratorStep4ExportProps) {
  const t = useTranslations("Generator");
  const { headers, rows } = useMemo(() => csvToTableData(csvPreview), [csvPreview]);

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
        {headers.length > 0 ? (
          <div className="rounded-xl border-2 border-ink/10 bg-ink/5 overflow-auto max-h-80">
            <table className="w-full text-sm font-[family-name:var(--font-fredoka)] text-ink/90 border-collapse">
              <thead>
                <tr className="border-b-2 border-ink/10">
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left font-bold py-3 px-4 bg-ink/5 text-ink first:rounded-tl-xl last:rounded-tr-xl [&:first-child]:pl-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-ink/10 last:border-b-0 hover:bg-ink/5 transition-colors"
                  >
                    {headers.map((_, ci) => (
                      <td
                        key={ci}
                        className="py-2.5 px-4 align-top max-w-[12rem] truncate"
                        title={row[ci]}
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
