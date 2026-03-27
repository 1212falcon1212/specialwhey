"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/storefront/products/product-card";
import type { Ingredient } from "@/types/ingredient";

interface ProductGridProps {
  ingredients: Ingredient[];
  loading?: boolean;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-5 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGrid({ ingredients, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <h3 className="text-lg font-semibold text-foreground">
          Ürün bulunamadı
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Farklı filtreler deneyerek tekrar arayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {ingredients.map((ingredient) => (
        <ProductCard key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}
