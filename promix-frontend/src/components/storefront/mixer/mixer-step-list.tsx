"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Protein Bazı", icon: "1" },
  { label: "Aroma", icon: "2" },
  { label: "Ekstralar", icon: "3" },
  { label: "Bidon", icon: "4" },
  { label: "Özet", icon: "5" },
];

interface MixerStepListProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function MixerStepList({ currentStep, onStepClick }: MixerStepListProps) {
  return (
    <nav className="sticky top-24 space-y-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isClickable = index <= currentStep;

        return (
          <button
            key={step.label}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors",
              isActive &&
                "bg-[rgba(255,107,44,0.08)] text-[#ff6b2c] ring-1 ring-[rgba(255,107,44,0.2)]",
              isCompleted &&
                "text-[#ff6b2c] hover:bg-[rgba(255,107,44,0.08)] cursor-pointer",
              !isActive &&
                !isCompleted &&
                "text-[#888888] cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isActive && "bg-[#ff6b2c] text-white",
                isCompleted && "bg-[rgba(255,107,44,0.12)] text-[#ff6b2c]",
                !isActive && !isCompleted && "bg-[#f0f0ee] text-[#888888]",
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                step.icon
              )}
            </span>
            <span className="truncate">{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
