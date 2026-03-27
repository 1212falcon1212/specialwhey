"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MixerIngredientCard } from "./mixer-ingredient-card";
import type { Ingredient } from "@/types";

interface MixerStepProteinProps {
  ingredients: Ingredient[];
  loading: boolean;
}

export function MixerStepProtein({
  ingredients,
  loading,
}: MixerStepProteinProps) {
  const { selectedProtein, selectProtein, nextStep } = useMixerStore();

  function handleSelect(
    ingredientId: number,
    optionId: number | undefined,
    name: string,
    price: number,
    image?: string,
  ) {
    selectProtein({ ingredientId, optionId, name, price, image });
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
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
          Henüz protein bazı bulunamadı.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#1a1a1a] sm:text-2xl">
          Protein Bazını Seç
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Karışımının temelini oluşturacak protein türünü seç.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ingredients.map((ingredient) => (
          <MixerIngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            isSelected={selectedProtein?.ingredientId === ingredient.id}
            selectedOptionId={
              selectedProtein?.ingredientId === ingredient.id
                ? selectedProtein.optionId
                : undefined
            }
            onSelect={handleSelect}
            mode="single"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={nextStep}
          disabled={!selectedProtein}
          className="bg-[#ff6b2c] hover:bg-[#e85a1e] disabled:opacity-50"
          size="lg"
        >
          Devam Et
        </Button>
      </div>
    </div>
  );
}
