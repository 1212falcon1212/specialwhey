"use client";

import type { IngredientOption } from "@/types/ingredient";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface OptionSelectorProps {
  options: IngredientOption[];
  selected: IngredientOption | null;
  onSelect: (option: IngredientOption) => void;
}

export function OptionSelector({
  options,
  selected,
  onSelect,
}: OptionSelectorProps) {
  if (options.length === 0) {
    return null;
  }

  const sortedOptions = [...options].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Gramaj Secimi
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {sortedOptions.map((option) => {
          const isSelected = selected?.id === option.id;
          const isOutOfStock = option.stock_quantity <= 0;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelect(option)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-3 text-sm transition-all",
                isSelected
                  ? "border-[#ff6b2c] bg-[rgba(255,107,44,0.08)] text-[#1a1a1a]"
                  : "border-border bg-background hover:border-[rgba(255,107,44,0.3)] hover:bg-[rgba(255,107,44,0.04)]",
                isOutOfStock && "cursor-not-allowed opacity-50"
              )}
            >
              <span className="font-semibold">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.amount}g
              </span>
              <span
                className={cn(
                  "font-bold",
                  isSelected ? "text-[#ff6b2c]" : "text-foreground"
                )}
              >
                {formatPrice(option.price)}
              </span>
              {isOutOfStock && (
                <span className="absolute -top-2 right-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                  Tukendi
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
