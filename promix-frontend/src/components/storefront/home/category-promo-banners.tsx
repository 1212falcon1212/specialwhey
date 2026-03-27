"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/ingredient";

export function CategoryPromoBanners() {
  const { data, isLoading } = useApi<Banner[]>("/storefront/banners?position=category_promo");
  const banners = (data?.data ?? []).slice(0, 3);

  if (!isLoading && banners.length === 0) return null;

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link ?? "/urunler"}
              className="group relative overflow-hidden rounded-lg aspect-[4/3]"
            >
              {banner.image ? (
                <Image src={banner.image} alt={banner.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#f5f5f3] to-[#f0f0ee]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="font-display text-lg font-bold text-white">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="mt-1 text-sm text-white/40">{banner.subtitle}</p>
                )}
                <span className="mt-3 inline-flex w-fit rounded-lg bg-[#ff6b2c] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#e85a1e]">
                  {banner.button_text ?? "Alışverişe Başla"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
