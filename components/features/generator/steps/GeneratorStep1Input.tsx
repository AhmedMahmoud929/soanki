"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeneratorCard } from "../GeneratorCard";
import { CardSkeleton } from "../CardSkeleton";
import type {
  GeneratorCard as CardType,
  GeneratorLanguage,
  GeneratorExplainingLanguage,
  GeneratorLevel,
} from "../types";
import Image from "next/image";

const selectTriggerClass =
  "rounded-xl border-2 border-ink/10 bg-paper h-auto px-4 py-2.5 text-ink font-[family-name:var(--font-fredoka)] focus:border-soft-blue focus:ring-2 focus:ring-soft-blue/20 w-[180px]";

const EXPLAINING_LANGUAGES: GeneratorExplainingLanguage[] = ["en", "de", "ar"];

const explainingLanguageFlags: Record<GeneratorExplainingLanguage, string> = {
  en: "/images/flags/united-kingdom.png",
  de: "/images/flags/german.png",
  ar: "/images/flags/egypt.png",
};

type GeneratorStep1InputProps = {
  inputText: string;
  setInputText: (value: string) => void;
  language: GeneratorLanguage;
  setLanguage: (value: GeneratorLanguage) => void;
  explainingLanguage: GeneratorExplainingLanguage;
  setExplainingLanguage: (value: GeneratorExplainingLanguage) => void;
  level: GeneratorLevel;
  setLevel: (value: GeneratorLevel) => void;
  onGenerate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isGenerating: boolean;
  pendingCardCount: number;
  cards: CardType[];
  onRemoveCard: (id: string) => void;
  onRegenerateImage: (card: CardType) => void;
  regeneratingImageCardId: string | null;
};

const generateByAiButtonClass =
  "rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-bold px-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] disabled:opacity-60 inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)]";

const LEVELS: GeneratorLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export function GeneratorStep1Input({
  inputText,
  setInputText,
  language,
  setLanguage,
  explainingLanguage,
  setExplainingLanguage,
  level,
  setLevel,
  onGenerate,
  onFileUpload,
  fileInputRef,
  isGenerating,
  pendingCardCount,
  cards,
  onRemoveCard,
  onRegenerateImage,
  regeneratingImageCardId,
}: GeneratorStep1InputProps) {
  const t = useTranslations("Generator");

  return (
    <>
      <section className="space-y-6">
        <div className="rounded-2xl border-2 border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor="gen-language"
                className="block text-sm font-medium text-ink/70 mb-1.5 font-[family-name:var(--font-fredoka)]"
              >
                {t("options.language")}
              </label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as GeneratorLanguage)}
              >
                <SelectTrigger id="gen-language" className={selectTriggerClass}>
                  <SelectValue placeholder={t("options.language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">
                    <div className="flex items-center gap-2">
                      <Image src="/images/flags/german.png" alt="German" width={20} height={20} />
                      <span>{t("options.languageDe")}</span>

                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <Image src="/images/flags/united-kingdom.png" alt="English" width={20} height={20} />
                      <span>{t("options.languageEn")}</span>
                    </div>
                  </SelectItem>
                  {/* <SelectItem value="ar">{t("options.languageAr")}</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="gen-explaining-language"
                className="block text-sm font-medium text-ink/70 mb-1.5 font-[family-name:var(--font-fredoka)]"
              >
                {t("options.explainingLanguage")}
              </label>
              <Select
                value={explainingLanguage}
                onValueChange={(value) =>
                  setExplainingLanguage(value as GeneratorExplainingLanguage)
                }
              >
                <SelectTrigger
                  id="gen-explaining-language"
                  className={selectTriggerClass}
                >
                  <SelectValue placeholder={t("options.explainingLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  {EXPLAINING_LANGUAGES.map((code) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={explainingLanguageFlags[code]}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-sm object-cover shrink-0"
                        />
                        <span>{t(`options.language${code === "en" ? "En" : code === "de" ? "De" : "Ar"}`)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="gen-level"
                className="block text-sm font-medium text-ink/70 mb-1.5 font-[family-name:var(--font-fredoka)]"
              >
                {t("options.level")}
              </label>
              <Select
                value={level}
                onValueChange={(value) => setLevel(value as GeneratorLevel)}
              >
                <SelectTrigger id="gen-level" className={selectTriggerClass}>
                  <SelectValue placeholder={t("options.level")} />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {t(`options.level${l}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <label
            htmlFor="word-input"
            className="block text-sm font-medium text-ink/70 mb-2 font-[family-name:var(--font-fredoka)]"
          >
            {t("input.placeholder")}
          </label>
          <textarea
            id="word-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("input.placeholder")}
            rows={6}
            className="w-full rounded-xl border-2 border-ink/10 bg-paper px-4 py-3 text-ink font-[family-name:var(--font-fredoka)] placeholder:text-ink/40 focus:border-soft-blue focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className={generateByAiButtonClass}
            >
              <Icon icon="solar:magic-stick-3-bold" className="size-5" />
              {isGenerating ? t("card.loading") : t("generateByAi.step1")}
            </Button>
            <span className="text-ink/50 font-[family-name:var(--font-fredoka)]">
              {t("input.or")}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              className="hidden"
              onChange={onFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-ink/10 hover:border-soft-blue hover:text-soft-blue-dark font-[family-name:var(--font-fredoka)]"
            >
              <Icon icon="solar:upload-bold" className="size-5" />
              {t("input.upload")}
            </Button>
          </div>
        </div>
      </section>

      {/* Skeletons while generating */}
      {isGenerating && pendingCardCount > 0 && (
        <section className="mt-10">
          <p className="text-ink/60 font-[family-name:var(--font-fredoka)] mb-4">
            {t("export.previewHint")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pendingCardCount }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      )}

      {/* Cards after error (or preview when no loading) */}
      {cards.length > 0 && !isGenerating && (
        <section className="mt-10">
          <p className="text-ink/60 font-[family-name:var(--font-fredoka)] mb-4">
            {t("export.previewHint")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <GeneratorCard
                key={card.id}
                card={card}
                step={1}
                onRemove={cards.length > 1 ? onRemoveCard : undefined}
                onRegenerateImage={onRegenerateImage}
                isRegeneratingImage={regeneratingImageCardId === card.id}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
