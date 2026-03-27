"use client";

import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import type { Ingredient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface MixerIngredientCardProps {
  ingredient: Ingredient;
  isSelected: boolean;
  selectedOptionId?: number;
  onSelect: (
    ingredientId: number,
    optionId: number | undefined,
    name: string,
    price: number,
    image?: string,
  ) => void;
  mode: "single" | "multi";
}

export function MixerIngredientCard({
  ingredient,
  isSelected,
  selectedOptionId,
  onSelect,
  mode,
}: MixerIngredientCardProps) {
  const options = ingredient.options ?? [];
  const defaultOption = options.find((o) => o.is_default) ?? options[0];
  const displayPrice =
    isSelected && selectedOptionId
      ? (options.find((o) => o.id === selectedOptionId)?.price ??
        ingredient.base_price)
      : (defaultOption?.price ?? ingredient.base_price);

  function handleCardClick() {
    if (isSelected && mode === "multi") {
      onSelect(ingredient.id, undefined, ingredient.name, 0);
      return;
    }

    const optionToUse = selectedOptionId
      ? options.find((o) => o.id === selectedOptionId)
      : defaultOption;

    onSelect(
      ingredient.id,
      optionToUse?.id,
      ingredient.name,
      optionToUse?.price ?? ingredient.base_price,
      ingredient.image ?? undefined,
    );
  }

  function handleOptionClick(
    e: React.MouseEvent,
    optionId: number,
    price: number,
  ) {
    e.stopPropagation();
    onSelect(
      ingredient.id,
      optionId,
      ingredient.name,
      price,
      ingredient.image ?? undefined,
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-[#ffffff] transition-all hover:shadow-md",
        isSelected
          ? "border-[#ff6b2c] bg-[rgba(255,107,44,0.08)] shadow-md"
          : "border-[rgba(255,107,44,0.1)] hover:border-[rgba(255,107,44,0.3)]",
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b2c]">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f3]">
        {ingredient.image ? (
          <Image
            src={ingredient.image}
            alt={ingredient.name}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#888888]">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#1a1a1a]">
          {ingredient.name}
        </h3>
        {ingredient.short_description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-[#888888]">
            {ingredient.short_description}
          </p>
        )}

        {/* Price */}
        <p
          className={cn(
            "mt-2 text-sm font-bold",
            isSelected ? "text-[#ff6b2c]" : "text-[#1a1a1a]",
          )}
        >
          {formatPrice(displayPrice)}
        </p>

        {/* Options */}
        {options.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {options.map((option) => {
              const isOptionSelected =
                isSelected && selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={(e) => handleOptionClick(e, option.id, option.price)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                    isOptionSelected
                      ? "bg-[#ff6b2c] text-white"
                      : "bg-[#f0f0ee] text-[#666666] hover:bg-[#e8e8e6]",
                  )}
                >
                  {option.label} - {formatPrice(option.price)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
