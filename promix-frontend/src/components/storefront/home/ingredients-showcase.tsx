"use client";

import Image from "next/image";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ingredient } from "@/types/ingredient";

const DEMO_INGREDIENTS = [
  { id: -1, name: "Whey Protein", category: { name: "Protein Bazları" }, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80&auto=format" },
  { id: -2, name: "Whey İzolat", category: { name: "Protein Bazları" }, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=400&q=80&auto=format" },
  { id: -3, name: "Çikolata Aroma", category: { name: "Aromalar" }, image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format" },
  { id: -4, name: "Vanilya Aroma", category: { name: "Aromalar" }, image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80&auto=format" },
  { id: -5, name: "BCAA", category: { name: "Ekstra Bileşenler" }, image: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&q=80&auto=format" },
  { id: -6, name: "Kreatin", category: { name: "Ekstra Bileşenler" }, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80&auto=format" },
  { id: -7, name: "Glutamin", category: { name: "Ekstra Bileşenler" }, image: "https://images.unsplash.com/photo-1505576399279-0d754c0d0cb1?w=400&q=80&auto=format" },
  { id: -8, name: "Kazein", category: { name: "Protein Bazları" }, image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80&auto=format" },
];

export function IngredientsShowcase() {
  const { data, isLoading } = usePaginatedApi<Ingredient>(
    "/storefront/ingredients?per_page=8"
  );
  const apiIngredients = data?.data ?? [];
  const ingredients = apiIngredients.length > 0 ? apiIngredients : DEMO_INGREDIENTS as unknown as Ingredient[];

  return (
    <section id="bilesenler" className="py-16 md:py-24 bg-[#f5f5f3]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
              Bileşenlerimiz
            </h2>
            <p className="mt-2 text-[#888888]">
              Protein bazları, aromalar ve ekstra bileşenler.
            </p>
          </div>
          <Link
            href="/bilesenler"
            className="hidden text-sm font-semibold text-[#ff6b2c] hover:text-[#e85a1e] transition-colors sm:block"
          >
            Tümünü Gör &rarr;
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))
            : ingredients.map((item) => {
                const cardContent = (
                  <>
                    {/* Image — dominant */}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#ccc]">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                      )}
                      {/* Gradient over image bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Name on image */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="font-display text-sm font-bold text-white md:text-base">
                          {item.name}
                        </h3>
                        {item.category && (
                          <p className="text-xs text-white/60">
                            {item.category.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );

                if (item.id < 0) {
                  return (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-2xl bg-white"
                    >
                      {cardContent}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/bilesenler/${item.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-lg"
                  >
                    {cardContent}
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
