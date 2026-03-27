"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MixerIngredientCard } from "./mixer-ingredient-card";
import type { Ingredient } from "@/types";

interface MixerStepExtrasProps {
  ingredients: Ingredient[];
  loading: boolean;
}

export function MixerStepExtras({
  ingredients,
  loading,
}: MixerStepExtrasProps) {
  const { selectedExtras, toggleExtra, nextStep, prevStep } = useMixerStore();

  function handleSelect(
    ingredientId: number,
    optionId: number | undefined,
    name: string,
    price: number,
    image?: string,
  ) {
    toggleExtra({ ingredientId, optionId, name, price, image });
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#eeeeee] py-16">
        <p className="text-sm text-[#888888]">
          Henüz ekstra bileşen bulunamadı.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={prevStep} variant="outline" size="lg">
            Geri
          </Button>
          <Button
            onClick={nextStep}
            className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
            size="lg"
          >
            Devam Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1a1a1a] sm:text-2xl">
            Ekstra Bileşenler
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            Karışımını güçlendirecek ekstra bileşenleri seç. (Opsiyonel)
          </p>
        </div>
        {selectedExtras.length > 0 && (
          <Badge className="bg-[rgba(255,107,44,0.12)] text-[#ff6b2c] hover:bg-[rgba(255,107,44,0.12)]">
            {selectedExtras.length} seçili
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ingredients.map((ingredient) => {
          const selected = selectedExtras.find(
            (e) => e.ingredientId === ingredient.id,
          );
          return (
            <MixerIngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              isSelected={!!selected}
              selectedOptionId={selected?.optionId}
              onSelect={handleSelect}
              mode="multi"
            />
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={prevStep} variant="outline" size="lg">
          Geri
        </Button>
        <Button
          onClick={nextStep}
          className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
          size="lg"
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}
