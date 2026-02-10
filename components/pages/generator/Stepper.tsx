"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export type GeneratorStep = 1 | 2 | 3 | 4;

type StepperProps = {
  currentStep: GeneratorStep;
  onStepClick?: (step: GeneratorStep) => void;
};

const steps: GeneratorStep[] = [1, 2, 3, 4];

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  const t = useTranslations("Generator.stepper");

  const labels: Record<GeneratorStep, string> = {
    1: t("step1"),
    2: t("step2"),
    3: t("step3"),
    4: t("step4"),
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-6 px-4 border-b border-ink/10 bg-white/80"
      aria-label="Pipeline steps"
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step;
        const isPast = currentStep > step;
        return (
          <div key={step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepClick?.(step)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-blue focus-visible:ring-offset-2",
                isActive && "bg-soft-blue-dark text-white shadow-md",
                isPast && "bg-soft-blue/20 text-soft-blue-dark",
                !isActive && !isPast && "bg-ink/5 text-ink/60 hover:bg-ink/10 hover:text-ink"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                  isActive && "bg-white/20",
                  isPast && "bg-soft-blue-dark/20"
                )}
              >
                {step}
              </span>
              <span className="hidden sm:inline">{labels[step]}</span>
            </button>
            {index < steps.length - 1 && (
              <Icon
                icon="solar:arrow-right-linear"
                className="size-5 text-ink/30 flex-shrink-0 rtl:rotate-180"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
