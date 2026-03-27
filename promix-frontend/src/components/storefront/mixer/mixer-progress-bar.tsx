"use client";

import { cn } from "@/lib/utils";

const STEP_LABELS = ["Protein", "Aroma", "Ekstra", "Ozet"];

interface MixerProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function MixerProgressBar({
  currentStep,
  totalSteps,
}: MixerProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between text-xs text-[#888888]">
        <span className="font-medium text-[#555555]">
          Adim {currentStep + 1}/{totalSteps}
        </span>
        <span>{STEP_LABELS[currentStep]}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#222222]">
        <div
          className="h-full rounded-full bg-[#ff6b2c] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between">
        {STEP_LABELS.map((label, index) => (
          <span
            key={label}
            className={cn(
              "text-[10px] font-medium",
              index <= currentStep ? "text-[#ff6b2c]" : "text-[#888888]",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
