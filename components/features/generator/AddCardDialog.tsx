"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/lib/hooks";
import type { GeneratorCard as CardType } from "./types";

export type ApiCard = {
  front: string;
  back: string;
  example: string;
  imageDescription: string;
  type: string;
};

type AddCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (card: CardType) => void;
  createCard: (overrides: Partial<CardType> & { word: string }) => CardType;
};

export function AddCardDialog({
  open,
  onOpenChange,
  onCreated,
  createCard,
}: AddCardDialogProps) {
  const t = useTranslations("Generator");
  const [word, setWord] = useState("");

  const createCardMutation = useApiMutation<{ card: ApiCard }, string>({
    mutationFn: async (singleWord) => {
      const res = await fetch("/api/create-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: singleWord }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create card");
      }
      return data as { card: ApiCard };
    },
    onSuccess: (data) => {
      const c = data.card;
      const card = createCard({
        word: c.front,
        meaning: c.back,
        example: c.example,
        partOfSpeech: c.type,
        imageDescription: c.imageDescription,
        loading: false,
      });
      onCreated(card);
      onOpenChange(false);
      setWord("");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = word.trim();
      if (!trimmed) return;
      createCardMutation.mutate(trimmed);
    },
    [word, createCardMutation]
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) setWord("");
      createCardMutation.reset();
      onOpenChange(next);
    },
    [onOpenChange, createCardMutation]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="font-[family-name:var(--font-fredoka)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-ink">{t("input.addCard")}</DialogTitle>
          <DialogDescription className="text-ink/70">
            {t("input.addCardDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div>
            <label
              htmlFor="add-card-word"
              className="block text-sm font-medium text-ink/80 mb-1.5"
            >
              {t("card.word")}
            </label>
            <input
              id="add-card-word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. die Freiheit"
              disabled={createCardMutation.isLoading}
              className="w-full rounded-xl border-2 border-ink/10 bg-paper px-4 py-2.5 text-ink placeholder:text-ink/40 focus:border-soft-blue focus:outline-none focus:ring-2 focus:ring-soft-blue/20"
              autoFocus
            />
          </div>
          {createCardMutation.error && (
            <p className="text-sm text-red-600" role="alert">
              {createCardMutation.error.message}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createCardMutation.isLoading}
              className="rounded-xl border-2 border-ink/10"
            >
              {t("input.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!word.trim() || createCardMutation.isLoading}
              className="rounded-xl bg-soft-blue-dark hover:bg-soft-blue-dark/90"
            >
              <Icon icon="solar:add-circle-bold" className="size-5" />
              {createCardMutation.isLoading ? t("card.loading") : t("input.addCard")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
