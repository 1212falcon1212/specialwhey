"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/ingredient";

export function SplitBanner() {
  const { data, isLoading } = useApi<Banner[]>(
    "/storefront/banners?position=fullwidth_promo"
  );
  const DEMO_BANNER = {
    id: -1,
    title: "Premium Kalite Bileşenler",
    subtitle: "Tüm bileşenlerimiz güvenilir üreticilerden temin edilmektedir. Her ürün kalite kontrolünden geçirilerek paketlenir ve bidonunla birlikte gönderilir.",
    image: "https://images.unsplash.com/photo-1559757148-5c688a4d6e5f?w=1200&q=80&auto=format",
    mobile_image: null,
    link: "/proteinini-olustur",
    button_text: "Karışımını Oluştur",
    position: "fullwidth_promo" as const,
  } as unknown as Banner;

  const banner = data?.data?.[0] ?? DEMO_BANNER;

  if (isLoading) {
    return (
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a]">
          {/* Full-bleed background image */}
          {banner.image && (
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="100vw"
              unoptimized
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Content — left-aligned on the image */}
          <div className="relative flex min-h-[320px] items-center md:min-h-[400px]">
            <div className="max-w-lg p-8 md:p-12">
              <h2 className="font-display text-3xl font-black leading-tight text-white md:text-4xl">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="mt-3 text-base text-white/70 leading-relaxed">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <Link
                  href={banner.link}
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-[#ff6b2c] px-7 text-sm font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_6px_24px_rgba(255,107,44,0.3)]"
                >
                  {banner.button_text || "Keşfet"} &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
