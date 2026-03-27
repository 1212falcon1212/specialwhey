"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ingredient, Category } from "@/types/ingredient";

export function IngredientsListPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const categoryUrl = selectedSlug
    ? `/storefront/ingredients?per_page=50&category_slug=${selectedSlug}`
    : "/storefront/ingredients?per_page=50";

  const { data: ingredientsData, isLoading: ingredientsLoading } =
    usePaginatedApi<Ingredient>(categoryUrl);
  const { data: categoriesData } = useApi<Category[]>(
    "/storefront/categories"
  );

  const ingredients = ingredientsData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[#888888]" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#ff6b2c] transition-colors">
                Anasayfa
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#1a1a1a] font-medium">Bilesenler</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
            Bilesenlerimiz
          </h1>
          <p className="mt-2 text-[#888888]">
            Protein bazlari, aromalar ve ekstra bilesenler hakkinda detayli
            bilgi.
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSlug(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedSlug === null
                  ? "bg-[#ff6b2c] text-white"
                  : "border border-[#eeeeee] bg-white text-[#555555] hover:border-[#ff6b2c] hover:text-[#ff6b2c]"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSlug(cat.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSlug === cat.slug
                    ? "bg-[#ff6b2c] text-white"
                    : "border border-[#eeeeee] bg-white text-[#555555] hover:border-[#ff6b2c] hover:text-[#ff6b2c]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ingredientsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))
            : ingredients.length === 0
              ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[#888888] text-lg">
                    Bu kategoride bilesen bulunamadi.
                  </p>
                </div>
              )
              : ingredients.map((item) => (
                <Link
                  key={item.id}
                  href={`/bilesenler/${item.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#eeeeee]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-[#ccc]"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                    )}
                    {/* Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Text on image */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h2 className="font-display text-sm font-bold text-white md:text-base">
                        {item.name}
                      </h2>
                      {item.category && (
                        <p className="text-xs text-white/60">
                          {item.category.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
