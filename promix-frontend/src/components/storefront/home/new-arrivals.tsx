"use client";

import { useApi } from "@/hooks/use-api";
import { SectionHeader } from "@/components/storefront/shared/section-header";
import { ProductCard } from "@/components/storefront/products/product-card";
import { ProductCardSkeleton } from "@/components/storefront/shared/skeletons";
import type { Ingredient } from "@/types/ingredient";

export function NewArrivals() {
  const { data, isLoading } = useApi<Ingredient[]>(
    "/storefront/ingredients?sort_by=newest&per_page=8"
  );
  const ingredients = data?.data ?? [];

  if (!isLoading && ingredients.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <SectionHeader title="YENİ" boldTitle="ÜRÜNLER" viewAllHref="/urunler?siralama=newest" viewAllText="Tüm Ürünleri Gör" />
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {ingredients.slice(0, 8).map((ingredient) => (
                <ProductCard key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
