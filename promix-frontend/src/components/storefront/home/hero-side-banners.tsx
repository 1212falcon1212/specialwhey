"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/ingredient";

export function HeroSideBanners() {
  const { data, isLoading } = useApi<Banner[]>("/storefront/banners?position=sidebar");
  const banners = (data?.data ?? []).slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col gap-4">
        <Skeleton className="flex-1 rounded-lg" />
        <Skeleton className="flex-1 rounded-lg" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="flex h-[400px] flex-col gap-4">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.link ?? "/urunler"}
          className="group relative flex-1 overflow-hidden rounded-lg"
        >
          {banner.image ? (
            <Image src={banner.image} alt={banner.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="260px" unoptimized />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
            <h3 className="font-display text-sm font-bold">{banner.title}</h3>
            {banner.subtitle && (
              <p className="mt-0.5 text-xs text-white/40">{banner.subtitle}</p>
            )}
            {banner.button_text && (
              <span className="mt-2 inline-flex w-fit rounded bg-[#ff6b2c] px-3 py-1 text-xs font-medium transition-colors group-hover:bg-[#e85a1e]">
                {banner.button_text}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
