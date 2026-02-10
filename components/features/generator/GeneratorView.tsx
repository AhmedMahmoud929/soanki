"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Stepper, type GeneratorStep } from "./Stepper";
import { AddCardDialog } from "./AddCardDialog";
import { useApiMutation } from "@/lib/hooks";
import type {
  GeneratorCard as CardType,
  GeneratorLanguage,
  GeneratorExplainingLanguage,
  GeneratorLevel,
} from "./types";
import {
  GeneratorStep1Input,
  GeneratorStep2Cards,
  // GeneratorStep3Audio, // Audio step – skipped for now; enable in a future version
  GeneratorStep4Export,
} from "./steps";

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

const EXPORT_SEPARATOR = "\t";

function sanitizeCell(value: string): string {
  return String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function generateExportTxt(cards: CardType[]): string {
  const rows = cards.map((c) => {
    const imageCell = c.imageUrl
      ? `<img src="${sanitizeCell(c.imageUrl).replace(/"/g, "&quot;")}" />`
      : "";
    const front = sanitizeCell(c.word);
    const back = sanitizeCell(c.meaning);
    const example = sanitizeCell(c.example);
    const type = sanitizeCell(c.partOfSpeech);
    return [front, back, example, imageCell, type].join(EXPORT_SEPARATOR);
  });
  return rows.join("\n");
}

export function GeneratorView() {
  const t = useTranslations("Generator");
  const [currentStep, setCurrentStep] = useState<GeneratorStep>(1);
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState<GeneratorLanguage>("de");
  const [explainingLanguage, setExplainingLanguage] =
    useState<GeneratorExplainingLanguage>("en");
  const [level, setLevel] = useState<GeneratorLevel>("A2");
  const [cards, setCards] = useState<CardType[]>([]);
  const [pendingCardCount, setPendingCardCount] = useState(0);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [regeneratingImageCardId, setRegeneratingImageCardId] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPreparingDeck, setIsPreparingDeck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateDeck = useApiMutation<
    GenerateDeckResponse,
    {
      words: string[];
      language: GeneratorLanguage;
      explainingLanguage: GeneratorExplainingLanguage;
      level: GeneratorLevel;
    }
  >({
    mutationFn: async ({ words, language, explainingLanguage, level }) => {
      const res = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words,
          language,
          explainingLanguage,
          level,
        }),
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
        variables.words.map((word) =>
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
    generateDeck.mutate({
      words: lines,
      language,
      explainingLanguage,
      level,
    });
  }, [inputText, language, explainingLanguage, level, generateDeck.mutate]);

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

  const handleGenerateAudioByAi = useCallback(async () => {
    const needAudio = cards.filter(
      (c) =>
        (c.word?.trim() && !c.frontAudioUrl) ||
        (c.example?.trim() && !c.exampleAudioUrl)
    );
    if (needAudio.length === 0) return;
    setIsGeneratingAudio(true);
    try {
      const updates: Array<{
        id: string;
        frontAudioUrl?: string;
        exampleAudioUrl?: string;
      }> = [];
      for (const card of needAudio) {
        let frontAudioUrl: string | undefined;
        let exampleAudioUrl: string | undefined;
        if (card.word?.trim() && !card.frontAudioUrl) {
          try {
            const res = await fetch("/api/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: `Say clearly: ${card.word.trim()}`,
              }),
            });
            if (res.ok) {
              const blob = await res.blob();
              frontAudioUrl = URL.createObjectURL(blob);
            }
          } catch {
            // skip this card's front audio
          }
        }
        if (card.example?.trim() && !card.exampleAudioUrl) {
          try {
            const res = await fetch("/api/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: `Say naturally: ${card.example.trim()}`,
              }),
            });
            if (res.ok) {
              const blob = await res.blob();
              exampleAudioUrl = URL.createObjectURL(blob);
            }
          } catch {
            // skip this card's example audio
          }
        }
        if (frontAudioUrl || exampleAudioUrl) {
          updates.push({
            id: card.id,
            ...(frontAudioUrl && { frontAudioUrl }),
            ...(exampleAudioUrl && { exampleAudioUrl }),
          });
        }
      }
      if (updates.length > 0) {
        setCards((prev) =>
          prev.map((c) => {
            const u = updates.find((x) => x.id === c.id);
            if (!u) return c;
            return {
              ...c,
              ...(u.frontAudioUrl && { frontAudioUrl: u.frontAudioUrl }),
              ...(u.exampleAudioUrl && { exampleAudioUrl: u.exampleAudioUrl }),
            };
          })
        );
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [cards]);

  const handlePrepareDeckByAi = useCallback(() => {
    setIsPreparingDeck(true);
    setTimeout(() => setIsPreparingDeck(false), 1500);
  }, []);

  const handleExportDeck = useCallback(() => {
    if (cards.length === 0) return;
    const txt = generateExportTxt(cards);
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const randomId = crypto.randomUUID().slice(0, 8);
    a.download = `soanki-deck-${randomId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const exportPreview = cards.length > 0 ? generateExportTxt(cards) : "";

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
        {currentStep === 1 && (
          <GeneratorStep1Input
            inputText={inputText}
            setInputText={setInputText}
            language={language}
            setLanguage={setLanguage}
            explainingLanguage={explainingLanguage}
            setExplainingLanguage={setExplainingLanguage}
            level={level}
            setLevel={setLevel}
            onGenerate={handleGenerate}
            onFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            isGenerating={generateDeck.isLoading}
            pendingCardCount={pendingCardCount}
            cards={cards}
            onRemoveCard={removeCard}
            onRegenerateImage={handleRegenerateImage}
            regeneratingImageCardId={regeneratingImageCardId}
          />
        )}

        {currentStep === 2 && (
          <GeneratorStep2Cards
            cards={cards}
            currentStep={currentStep}
            onRemoveCard={removeCard}
            onRegenerateImage={handleRegenerateImage}
            regeneratingImageCardId={regeneratingImageCardId}
            onGenerateImages={handleGenerateImagesByAi}
            isGeneratingImages={isGeneratingImages}
            getImageSearchQuery={getImageSearchQuery}
            onAddCard={() => setAddCardOpen(true)}
            onGoToExport={() => setCurrentStep(4)}
          />
        )}

        {/* Audio step – skipped for now; uncomment to enable */}
        {/* {currentStep === 3 && (
          <GeneratorStep3Audio
            cards={cards}
            currentStep={currentStep}
            onRemoveCard={removeCard}
            onRegenerateImage={handleRegenerateImage}
            regeneratingImageCardId={regeneratingImageCardId}
            onGenerateAudio={handleGenerateAudioByAi}
            isGeneratingAudio={isGeneratingAudio}
            onAddCard={() => setAddCardOpen(true)}
          />
        )} */}

        {currentStep === 4 && (
          <>
            <GeneratorStep2Cards
              cards={cards}
              currentStep={currentStep}
              onRemoveCard={removeCard}
              onRegenerateImage={handleRegenerateImage}
              regeneratingImageCardId={regeneratingImageCardId}
              onGenerateImages={handleGenerateImagesByAi}
              isGeneratingImages={isGeneratingImages}
              getImageSearchQuery={getImageSearchQuery}
              onAddCard={() => setAddCardOpen(true)}
            />
            <GeneratorStep4Export
              exportPreview={exportPreview}
              onPrepareDeck={handlePrepareDeckByAi}
              isPreparingDeck={isPreparingDeck}
              onExportDeck={handleExportDeck}
              hasCards={cards.length > 0}
            />
          </>
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
