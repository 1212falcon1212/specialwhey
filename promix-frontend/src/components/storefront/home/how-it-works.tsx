"use client";

import Image from "next/image";
import { useApi } from "@/hooks/use-api";
import type { Banner } from "@/types/ingredient";

const STEPS = [
  {
    number: "01",
    title: "Bileşenlerini Belirle",
    description:
      "Whey, izolat veya bitkisel protein bazını seç. Ardından aromayı ve BCAA, kreatin gibi ekstra bileşenleri ekle.",
  },
  {
    number: "02",
    title: "Özenle Paketlenir",
    description:
      "Seçtiğin bileşenler tek tek kontrol edilir, özel ambalajlarla paketlenir ve bidonunla birlikte hazırlanır.",
  },
  {
    number: "03",
    title: "Kargoya Verilir",
    description:
      "Paketin aynı gün kargoya teslim edilir. 1-3 iş günü içinde kapında.",
  },
] as const;

const DEMO_PROCESS_IMAGES = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80&auto=format",
  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80&auto=format",
];

export function HowItWorks() {
  const { data } = useApi<Banner[]>("/storefront/banners?position=process");
  const banners = data?.data ?? [];

  return (
    <section id="nasil-calisir" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
          Protein Nasıl{" "}
          <span className="text-[#ff6b2c]">Hazırlanır?</span>
        </h2>
        <p className="mt-2 text-[#888888] max-w-md">
          Sipariş verdiğinde paketin 3 adımda hazırlanır.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STEPS.map((step, i) => {
            const banner = banners[i];
            return (
              <div key={step.number} className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a]">
                {/* Background image from API or demo fallback */}
                {(banner?.image || DEMO_PROCESS_IMAGES[i]) ? (
                  <Image
                    src={banner?.image || DEMO_PROCESS_IMAGES[i]}
                    alt={step.title}
                    fill
                    className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2218]" />
                )}
                {/* Content overlay */}
                <div className="relative flex flex-col justify-between p-7 min-h-[280px] md:min-h-[320px]">
                  <span className="font-display text-5xl font-black text-white/10">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
