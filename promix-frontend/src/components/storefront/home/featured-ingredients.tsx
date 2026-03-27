"use client";

import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { SectionHeader } from "@/components/storefront/shared/section-header";
import { ProductCard } from "@/components/storefront/products/product-card";
import { ProductCardSkeleton } from "@/components/storefront/shared/skeletons";
import type { Ingredient } from "@/types/ingredient";

export function FeaturedIngredients() {
  const { data, isLoading, error } = useApi<Ingredient[]>(
    "/storefront/ingredients/featured"
  );
  const ingredients = data?.data;

  if (error || (!isLoading && (!ingredients || ingredients.length === 0))) {
    return null;
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <SectionHeader title="ÖNE ÇIKAN" boldTitle="ÜRÜNLER" viewAllHref="/urunler" viewAllText="Tüm Ürünleri Gör" />
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {ingredients!.slice(0, 5).map((ingredient) => (
                <ProductCard key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
          )}
        </div>
        {/* CTA Banner */}
        <Link
          href="/proteinini-olustur"
          className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#ff6b2c] to-[#e85a1e] px-6 py-4 text-white transition-colors hover:from-[#e85a1e] hover:to-[#c44a15]"
        >
          <div>
            <span className="text-lg font-bold">Proteinini Kendin Oluştur</span>
            <span className="ml-3 text-sm text-orange-100">İhtiyacına göre bileşenlerini seç, kendi formülünü oluştur.</span>
          </div>
          <span className="hidden shrink-0 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#ff6b2c] sm:inline-block">
            Hemen Başla
          </span>
        </Link>
      </div>
    </section>
  );
}
