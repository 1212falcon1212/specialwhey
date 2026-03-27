"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MixerIngredientCard } from "./mixer-ingredient-card";
import type { Ingredient } from "@/types";

interface MixerStepBidonProps {
  ingredients: Ingredient[];
  loading: boolean;
}

export function MixerStepBidon({
  ingredients,
  loading,
}: MixerStepBidonProps) {
  const { selectedBidon, selectBidon, nextStep, prevStep } = useMixerStore();

  function handleSelect(
    ingredientId: number,
    optionId: number | undefined,
    name: string,
    price: number,
    image?: string,
  ) {
    selectBidon({ ingredientId, optionId, name, price, image });
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#eeeeee] py-16">
        <p className="text-sm text-[#888888]">Henüz bidon bulunamadı.</p>
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
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#1a1a1a] sm:text-2xl">
          Bidon Seç
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Bileşenlerini karıştıracağın shaker veya bidonu seç.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ingredients.map((ingredient) => (
          <MixerIngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            isSelected={selectedBidon?.ingredientId === ingredient.id}
            selectedOptionId={
              selectedBidon?.ingredientId === ingredient.id
                ? selectedBidon.optionId
                : undefined
            }
            onSelect={handleSelect}
            mode="single"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={prevStep} variant="outline" size="lg">
          Geri
        </Button>
        <Button
          onClick={nextStep}
          disabled={!selectedBidon}
          className="bg-[#ff6b2c] hover:bg-[#e85a1e] disabled:opacity-50"
          size="lg"
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}
