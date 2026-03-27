"use client";

import { usePaginatedApi } from "@/hooks/use-api";
import { SectionHeader } from "@/components/storefront/shared/section-header";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "@/components/storefront/shared/skeletons";
import type { Ingredient } from "@/types/ingredient";

interface RelatedProductsProps {
  categorySlug: string;
  excludeId: number;
}

export function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  const { data, isLoading } = usePaginatedApi<Ingredient>(
    `/storefront/ingredients?category_slug=${categorySlug}&per_page=8`
  );
  const products = (data?.data ?? [])
    .filter((p) => p.id !== excludeId)
    .slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-14">
      <SectionHeader title="İLGİLİ" boldTitle="ÜRÜNLER" />
      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} ingredient={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
