"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

const GENERATOR_OPTIONS_KEY = "soanki_generator_options";

const VALID_LANGUAGES: GeneratorLanguage[] = ["de", "en", "ar"];
const VALID_LEVELS: GeneratorLevel[] = ["A1", "A2", "B1", "B2", "C1"];

function getStoredGeneratorOptions(): {
  language: GeneratorLanguage;
  explainingLanguage: GeneratorExplainingLanguage;
  level: GeneratorLevel;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GENERATOR_OPTIONS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    const lang = data?.language;
    const explaining = data?.explainingLanguage;
    const lvl = data?.level;
    if (
      typeof lang === "string" &&
      VALID_LANGUAGES.includes(lang as GeneratorLanguage) &&
      typeof explaining === "string" &&
      VALID_LANGUAGES.includes(explaining as GeneratorExplainingLanguage) &&
      typeof lvl === "string" &&
      VALID_LEVELS.includes(lvl as GeneratorLevel)
    ) {
      return {
        language: lang as GeneratorLanguage,
        explainingLanguage: explaining as GeneratorExplainingLanguage,
        level: lvl as GeneratorLevel,
      };
    }
  } catch {
    // ignore invalid or missing data
  }
  return null;
}

function setStoredGeneratorOptions(options: {
  language: GeneratorLanguage;
  explainingLanguage: GeneratorExplainingLanguage;
  level: GeneratorLevel;
}) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GENERATOR_OPTIONS_KEY, JSON.stringify(options));
  } catch {
    // ignore quota or other errors
  }
}

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

  // Load generator options from localStorage on mount
  useEffect(() => {
    const stored = getStoredGeneratorOptions();
    if (stored) {
      setLanguage(stored.language);
      setExplainingLanguage(stored.explainingLanguage);
      setLevel(stored.level);
    }
  }, []);

  // Persist generator options to localStorage when they change
  useEffect(() => {
    setStoredGeneratorOptions({ language, explainingLanguage, level });
  }, [language, explainingLanguage, level]);

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

  /** Build fallback search queries when the primary returns no image. */
  const getImageSearchFallbacks = useCallback((card: CardType) => {
    const primary = getImageSearchQuery(card);
    const fallbacks: string[] = [];
    if (card.meaning?.trim()) fallbacks.push(card.meaning.trim());
    if (card.word?.trim() && card.meaning?.trim() && card.word !== primary) {
      fallbacks.push(`${card.word} ${card.meaning}`);
    }
    if (card.word?.trim() && !fallbacks.includes(card.word.trim())) {
      fallbacks.push(card.word.trim());
    }
    return [primary, ...fallbacks].filter((q) => q.length > 0);
  }, [getImageSearchQuery]);

  type ImageForCardOptions = {
    language: GeneratorLanguage;
    explainingLanguage: GeneratorExplainingLanguage;
    level: GeneratorLevel;
  };

  /** Try image search with fallbacks; if still no image and options given, generate alternate example and retry. */
  const fetchImageForCard = useCallback(
    async (
      card: CardType,
      options?: ImageForCardOptions
    ): Promise<{
      imageUrl: string | null;
      newExample?: string;
      newImageDescription?: string;
    }> => {
      const tryQuery = async (q: string): Promise<string | null> => {
        if (!q.trim()) return null;
        try {
          const res = await fetch(
            `/api/search-image?q=${encodeURIComponent(q)}`
          );
          const data = (await res.json()) as {
            imageUrl?: string;
            error?: string;
          };
          if (res.ok && data.imageUrl) return data.imageUrl;
        } catch {
          // try next
        }
        return null;
      };

      const queries = getImageSearchFallbacks(card);
      for (const q of queries) {
        const imageUrl = await tryQuery(q);
        if (imageUrl) return { imageUrl };
      }

      // No image from current content: generate another example and search for that
      if (options?.language && options?.explainingLanguage && options?.level) {
        try {
          const res = await fetch("/api/generate-example", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              word: card.word,
              meaning: card.meaning || undefined,
              currentExample: card.example || undefined,
              language: options.language,
              explainingLanguage: options.explainingLanguage,
              level: options.level,
            }),
          });
          if (!res.ok) return { imageUrl: null };
          const alt = (await res.json()) as {
            example?: string;
            imageDescription?: string;
          };
          const newDesc = (alt.imageDescription ?? "").replace(
            /^#IMAGE#\s*-?\s*/i,
            ""
          ).trim();
          const imageUrl =
            (newDesc && (await tryQuery(newDesc))) ||
            (alt.example?.trim() && (await tryQuery(alt.example.trim()))) ||
            null;
          if (imageUrl) {
            return {
              imageUrl,
              newExample: alt.example?.trim(),
              newImageDescription: alt.imageDescription?.trim(),
            };
          }
        } catch {
          // leave as no image
        }
      }

      return { imageUrl: null };
    },
    [getImageSearchFallbacks]
  );

  const handleRegenerateImage = useCallback(
    async (card: CardType) => {
      if (!getImageSearchQuery(card) && !card.meaning?.trim() && !card.word?.trim()) return;
      setRegeneratingImageCardId(card.id);
      try {
        const result = await fetchImageForCard(card, {
          language,
          explainingLanguage,
          level,
        });
        if (result.imageUrl) {
          setCards((prev) =>
            prev.map((c) => {
              if (c.id !== card.id) return c;
              return {
                ...c,
                imageUrl: result.imageUrl!,
                ...(result.newExample != null && { example: result.newExample }),
                ...(result.newImageDescription != null && {
                  imageDescription: result.newImageDescription,
                }),
              };
            })
          );
        }
      } catch {
        // Leave card unchanged
      } finally {
        setRegeneratingImageCardId(null);
      }
    },
    [getImageSearchQuery, fetchImageForCard, language, explainingLanguage, level]
  );

  const handleGenerateImagesByAi = useCallback(async () => {
    const needImage = cards.filter(
      (c) =>
        !c.imageUrl &&
        (getImageSearchQuery(c) !== "" || c.meaning?.trim() !== "" || c.word?.trim() !== "")
    );
    if (needImage.length === 0) return;
    setIsGeneratingImages(true);
    try {
      const imageOptions = { language, explainingLanguage, level };
      const results = await Promise.allSettled(
        needImage.map(async (card) => {
          const result = await fetchImageForCard(card, imageOptions);
          return {
            id: card.id,
            imageUrl: result.imageUrl,
            newExample: result.newExample,
            newImageDescription: result.newImageDescription,
          };
        })
      );
      const updates = new Map<
        string,
        { imageUrl: string; example?: string; imageDescription?: string }
      >();
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value.imageUrl) {
          updates.set(r.value.id, {
            imageUrl: r.value.imageUrl,
            ...(r.value.newExample != null && { example: r.value.newExample }),
            ...(r.value.newImageDescription != null && {
              imageDescription: r.value.newImageDescription,
            }),
          });
        }
      });
      if (updates.size > 0) {
        setCards((prev) =>
          prev.map((c) => {
            const u = updates.get(c.id);
            if (!u) return c;
            return {
              ...c,
              imageUrl: u.imageUrl,
              ...(u.example != null && { example: u.example }),
              ...(u.imageDescription != null && {
                imageDescription: u.imageDescription,
              }),
            };
          })
        );
      }
    } finally {
      setIsGeneratingImages(false);
    }
  }, [cards, getImageSearchQuery, fetchImageForCard, language, explainingLanguage, level]);

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
