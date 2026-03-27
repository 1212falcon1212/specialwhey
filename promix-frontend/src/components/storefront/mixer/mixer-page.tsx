"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { usePaginatedApi } from "@/hooks/use-api";
import type { Ingredient } from "@/types";
import { MixerStepList } from "./mixer-step-list";
import { MixerProgressBar } from "./mixer-progress-bar";
import { MixerStepProtein } from "./mixer-step-protein";
import { MixerStepFlavor } from "./mixer-step-flavor";
import { MixerStepExtras } from "./mixer-step-extras";
import { MixerStepBidon } from "./mixer-step-bidon";
import { MixerStepSummary } from "./mixer-step-summary";
import { MixerSummary } from "./mixer-summary";
import { MixerMobileBottomBar } from "./mixer-mobile-bottom-bar";
import { MixerTemplateSelector } from "./mixer-template-selector";
import type { MixerTemplate } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

const STEP_CATEGORY_SLUGS = [
  "protein-bazlari",
  "aromalar",
  "ekstra-bilesenler",
  "bidonlar",
] as const;

const STEP_LABELS = ["Protein Bazı", "Aroma", "Ekstralar", "Bidon", "Özet"] as const;

export function MixerPage() {
  const { currentStep, setStep, selectProtein, selectFlavor, toggleExtra, selectBidon, reset } =
    useMixerStore();

  const categorySlug =
    currentStep < 4 ? STEP_CATEGORY_SLUGS[currentStep] : null;

  const { data: ingredientData, isLoading } = usePaginatedApi<Ingredient>(
    categorySlug
      ? `/storefront/ingredients?category_slug=${categorySlug}`
      : null,
  );

  const ingredients = ingredientData?.data ?? [];

  function handleStepClick(step: number) {
    if (step <= currentStep) {
      setStep(step);
    }
  }

  function handleSelectTemplate(template: MixerTemplate) {
    reset();

    if (!template.items) return;

    for (const item of template.items) {
      if (!item.ingredient) continue;

      const categorySlugOfItem = item.ingredient.category?.slug;
      const selectedItem = {
        ingredientId: item.ingredient.id,
        optionId: item.ingredient_option_id ?? undefined,
        name: item.ingredient.name,
        price: item.option?.price ?? item.ingredient.base_price,
        image: item.ingredient.image ?? undefined,
      };

      if (categorySlugOfItem === "protein-bazlari") {
        selectProtein(selectedItem);
      } else if (categorySlugOfItem === "aromalar") {
        selectFlavor(selectedItem);
      } else if (categorySlugOfItem === "ekstra-bilesenler") {
        toggleExtra(selectedItem);
      } else if (categorySlugOfItem === "bidonlar") {
        selectBidon(selectedItem);
      }
    }

    setStep(4);
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
              Paketini Oluştur
            </h1>
            <p className="mt-1 text-sm text-[#888888]">
              Adım adım bileşenlerini seç, bidonunu belirle.
            </p>
          </div>
          <MixerTemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>

        {/* Mobile progress bar */}
        <MixerProgressBar currentStep={currentStep} totalSteps={5} />

        {/* Main layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left sidebar - Step list (desktop) */}
          <div className="hidden lg:col-span-2 lg:block">
            <MixerStepList
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Center - Active step content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 0 && (
                  <MixerStepProtein
                    ingredients={ingredients}
                    loading={isLoading}
                  />
                )}
                {currentStep === 1 && (
                  <MixerStepFlavor
                    ingredients={ingredients}
                    loading={isLoading}
                  />
                )}
                {currentStep === 2 && (
                  <MixerStepExtras
                    ingredients={ingredients}
                    loading={isLoading}
                  />
                )}
                {currentStep === 3 && (
                  <MixerStepBidon
                    ingredients={ingredients}
                    loading={isLoading}
                  />
                )}
                {currentStep === 4 && <MixerStepSummary />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right sidebar - Live summary (desktop) */}
          <div className="hidden lg:col-span-3 lg:block">
            <MixerSummary />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MixerMobileBottomBar />
    </div>
  );
}
