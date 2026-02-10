"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Stepper, type GeneratorStep } from "./Stepper";
import { GeneratorCard } from "./GeneratorCard";
import { CardSkeleton } from "./CardSkeleton";
import { AddCardDialog } from "./AddCardDialog";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/lib/hooks";
import type { GeneratorCard as CardType } from "./types";
import { cn } from "@/lib/utils";

type GenerateDeckResponse = {
  cards: Array<{
    front: string;
    back: string;
    example: string;
    imageDescription: string;
    type: string;
  }>;
};

function createCard(overrides: Partial<CardType> & { word: string }): CardType {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    word: overrides.word,
    meaning: overrides.meaning ?? "",
    example: overrides.example ?? "",
    partOfSpeech: overrides.partOfSpeech ?? "",
    imageDescription: overrides.imageDescription,
    imageUrl: overrides.imageUrl,
    frontAudioUrl: overrides.frontAudioUrl,
    exampleAudioUrl: overrides.exampleAudioUrl,
    loading: overrides.loading ?? false,
  };
}

function generateCsvPreview(cards: CardType[]): string {
  const header = "word,meaning,example,partOfSpeech";
  const rows = cards.map((c) =>
    [c.word, c.meaning, c.example, c.partOfSpeech].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  );
  return [header, ...rows].join("\n");
}

export function GeneratorView() {
  const t = useTranslations("Generator");
  const [currentStep, setCurrentStep] = useState<GeneratorStep>(1);
  const [inputText, setInputText] = useState("");
  const [cards, setCards] = useState<CardType[]>([]);
  const [pendingCardCount, setPendingCardCount] = useState(0);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [regeneratingImageCardId, setRegeneratingImageCardId] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPreparingDeck, setIsPreparingDeck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateDeck = useApiMutation<GenerateDeckResponse, string[]>({
    mutationFn: async (words) => {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate deck");
      }
      return data as GenerateDeckResponse;
    },
    onSuccess: (data) => {
      setCards(
        data.cards.map((c) =>
          createCard({
            word: c.front,
            meaning: c.back,
            example: c.example,
            partOfSpeech: c.type,
            imageDescription: c.imageDescription,
            loading: false,
          })
        )
      );
      setPendingCardCount(0);
      setCurrentStep(2);
    },
    onError: (err, variables) => {
      setCards(
        variables.map((word) =>
          createCard({
            word,
            meaning: `Error: ${err.message}`,
            example: "",
            partOfSpeech: "",
            loading: false,
          })
        )
      );
      setPendingCardCount(0);
    },
  });

  const handleGenerate = useCallback(() => {
    const lines = inputText
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    setPendingCardCount(lines.length);
    generateDeck.mutate(lines);
  }, [inputText, generateDeck.mutate]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setInputText((prev) => (prev ? `${prev}\n${text}` : text));
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleCardCreated = useCallback((card: CardType) => {
    setCards((prev) => [...prev, card]);
  }, []);

  const getImageSearchQuery = useCallback((card: CardType) => {
    const raw =
      (card.imageDescription?.trim() || "").replace(/^#IMAGE#\s*-?\s*/i, "") ||
      card.word?.trim() ||
      "";
    return raw;
  }, []);

  const handleRegenerateImage = useCallback(
    async (card: CardType) => {
      const raw = getImageSearchQuery(card);
      if (!raw) return;
      setRegeneratingImageCardId(card.id);
      try {
        const res = await fetch(
          `/api/search-image?q=${encodeURIComponent(raw)}`
        );
        const data = (await res.json()) as { imageUrl?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Image search failed");
        if (data.imageUrl) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card.id ? { ...c, imageUrl: data.imageUrl! } : c
            )
          );
        }
      } catch {
        // Leave card unchanged; could show toast
      } finally {
        setRegeneratingImageCardId(null);
      }
    },
    [getImageSearchQuery]
  );

  const handleGenerateImagesByAi = useCallback(async () => {
    const needImage = cards.filter(
      (c) =>
        !c.imageUrl &&
        (getImageSearchQuery(c) !== "")
    );
    if (needImage.length === 0) return;
    setIsGeneratingImages(true);
    try {
      const results = await Promise.allSettled(
        needImage.map(async (card) => {
          const q = getImageSearchQuery(card);
          const res = await fetch(
            `/api/search-image?q=${encodeURIComponent(q)}`
          );
          const data = (await res.json()) as {
            imageUrl?: string;
            error?: string;
          };
          if (!res.ok || !data.imageUrl) return { id: card.id, imageUrl: null };
          return { id: card.id, imageUrl: data.imageUrl };
        })
      );
      const updates = new Map<string, string>();
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value.imageUrl) {
          updates.set(r.value.id, r.value.imageUrl);
        }
      });
      if (updates.size > 0) {
        setCards((prev) =>
          prev.map((c) => {
            const url = updates.get(c.id);
            return url ? { ...c, imageUrl: url } : c;
          })
        );
      }
    } finally {
      setIsGeneratingImages(false);
    }
  }, [cards, getImageSearchQuery]);

  const handleGenerateAudioByAi = useCallback(() => {
    setIsGeneratingAudio(true);
    setTimeout(() => setIsGeneratingAudio(false), 2000);
  }, []);

  const handlePrepareDeckByAi = useCallback(() => {
    setIsPreparingDeck(true);
    setTimeout(() => setIsPreparingDeck(false), 1500);
  }, []);

  const csvPreview = cards.length > 0 ? generateCsvPreview(cards) : "";

  const generateByAiButtonClass =
    "rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90 text-white font-bold px-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-hover)] disabled:opacity-60 inline-flex items-center gap-2 font-[family-name:var(--font-fredoka)]";

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-ink/10 bg-white/90 px-4 py-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-ink font-[family-name:var(--font-fredoka)]">
          {t("title")}
        </h1>
        <p className="mt-2 text-ink/60 font-[family-name:var(--font-fredoka)]">{t("subtitle")}</p>
      </div>

      <Stepper currentStep={currentStep} onStepClick={setCurrentStep} disabled={cards.length === 0 || generateDeck.isLoading} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Step 1: Input */}
        {currentStep === 1 && (
          <section className="space-y-6">
            <div className="rounded-2xl border-2 border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
              <label htmlFor="word-input" className="block text-sm font-medium text-ink/70 mb-2 font-[family-name:var(--font-fredoka)]">
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
                  onClick={handleGenerate}
                  disabled={generateDeck.isLoading}
                  className={generateByAiButtonClass}
                >
                  <Icon icon="solar:magic-stick-3-bold" className="size-5" />
                  {generateDeck.isLoading ? t("card.loading") : t("generateByAi.step1")}
                </Button>
                <span className="text-ink/50 font-[family-name:var(--font-fredoka)]">{t("input.or")}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
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
        )}

        {/* Cards grid (Steps 2, 3, 4) */}
        {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-ink/60 font-[family-name:var(--font-fredoka)]">
                {cards.length} {t("card.word")}(s)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    onClick={handleGenerateImagesByAi}
                    disabled={
                      isGeneratingImages ||
                      !cards.some(
                        (c) => !c.imageUrl && getImageSearchQuery(c) !== ""
                      )
                    }
                    className={generateByAiButtonClass}
                  >
                    <Icon icon="solar:magic-stick-3-bold" className="size-5" />
                    {isGeneratingImages ? t("card.loading") : t("generateByAi.step2")}
                  </Button>
                )}
                {currentStep === 3 && (
                  <Button
                    type="button"
                    onClick={handleGenerateAudioByAi}
                    disabled={isGeneratingAudio}
                    className={generateByAiButtonClass}
                  >
                    <Icon icon="solar:magic-stick-3-bold" className="size-5" />
                    {isGeneratingAudio ? t("card.loading") : t("generateByAi.step3")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddCardOpen(true)}
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
                  onRemove={cards.length > 1 ? removeCard : undefined}
                  onRegenerateImage={handleRegenerateImage}
                  isRegeneratingImage={regeneratingImageCardId === card.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Export (Step 4) */}
        {currentStep === 4 && (
          <section className="mt-10 rounded-2xl border-2 border-ink/10 bg-white p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-ink font-[family-name:var(--font-fredoka)] mb-4">
              {t("export.button")}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Button
                onClick={handlePrepareDeckByAi}
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
        )}

        {/* Step 1: show skeletons while generating */}
        {currentStep === 1 && generateDeck.isLoading && pendingCardCount > 0 && (
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

        {/* Step 1: show cards after error (or preview when no loading) */}
        {currentStep === 1 && cards.length > 0 && !generateDeck.isLoading && (
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
                  onRemove={cards.length > 1 ? removeCard : undefined}
                  onRegenerateImage={handleRegenerateImage}
                  isRegeneratingImage={regeneratingImageCardId === card.id}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <AddCardDialog
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onCreated={handleCardCreated}
        createCard={createCard}
      />
    </div>
  );
}
