"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import type { Banner } from "@/types/ingredient";

export function FullwidthPromoBanner() {
  const { data, isLoading } = useApi<Banner[]>("/storefront/banners?position=fullwidth_promo");
  const banner = data?.data?.[0];

  if (isLoading || !banner) return null;

  return (
    <section className="relative overflow-hidden bg-[#ff6b2c] py-14 md:py-20">
      {banner.image && (
        <Image src={banner.image} alt={banner.title} fill className="object-cover opacity-20" sizes="100vw" unoptimized />
      )}
      <div className="container relative mx-auto px-4 text-center text-white">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
          {banner.title}
        </h2>
        {banner.subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-base text-orange-100 md:text-lg">
            {banner.subtitle}
          </p>
        )}
        {banner.link && (
          <Link
            href={banner.link}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-bold text-[#ff6b2c] transition-colors hover:bg-[#f0f0ee]"
          >
            {banner.button_text ?? "Hemen Dene"}
          </Link>
        )}
      </div>
    </section>
  );
}
