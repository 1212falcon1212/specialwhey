"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import type { Banner } from "@/types/ingredient";

const STEPS = [
  {
    number: "01",
    label: "BİLEŞEN SEÇİMİ",
    title: "Bileşenlerini Belirle",
    description:
      "Whey protein, izolat veya kazein bazını seç. Ardından çikolata, vanilya gibi aromalardan birini ekle. BCAA, kreatin gibi ekstra bileşenlerle paketini güçlendir.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=600&fit=crop&q=80",
  },
  {
    number: "02",
    label: "BİDON SEÇİMİ",
    title: "Shaker Bidonunu Seç",
    description:
      "600ml klasik shaker'dan 1000ml premium termos bidona kadar ihtiyacına uygun bidonunu belirle. Tüm bidonlar BPA içermez ve sızdırmaz kapaklıdır.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop&q=80",
  },
  {
    number: "03",
    label: "SİPARİŞ",
    title: "Siparişini Tamamla",
    description:
      "Seçtiğin bileşenleri ve bidonu sepetine ekle. Teslimat adresini gir, ödeme yöntemini seç ve siparişini onayla. Güvenli ödeme altyapımızla bilgilerin koruma altında.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80",
  },
  {
    number: "04",
    label: "PAKETLEME",
    title: "Özenle Paketlenir",
    description:
      "Seçtiğin her bileşen tek tek kontrol edilir ve ayrı paketler halinde hazırlanır. Bidonunla birlikte özel kutusuna yerleştirilir, aynı gün kargoya verilir.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop&q=80",
  },
  {
    number: "05",
    label: "TESLİMAT",
    title: "Kapına Gelsin",
    description:
      "Paketin 1-3 iş günü içinde kapına ulaşır. Bileşenlerini bidonuna ekle, karıştır ve keyfini çıkar. Kontrolün tamamen sende.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=800&h=600&fit=crop&q=80",
  },
];

export function OrderFlow() {
  const { data } = useApi<Banner[]>("/storefront/banners?position=process");
  const banners = data?.data ?? [];

  return (
    <section className="overflow-hidden bg-[#f5f5f3] py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-10 bg-[#ff6b2c]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b2c]">
              SİPARİŞ SÜRECİ
            </span>
          </div>
          <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl lg:text-5xl">
            Nasıl Çalışır?
          </h2>
          <p className="mt-4 text-[#888888] leading-relaxed">
            Bileşenlerini seç, bidonunu belirle, siparişini ver. Paketin özenle
            hazırlanıp kapına gelsin.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#1a1a1a]/10 lg:block" />

          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              const bannerImage = banners[i]?.image;
              const imageSrc = bannerImage || step.image;

              return (
                <div key={step.number} className="relative">
                  {/* Timeline dot (desktop) */}
                  <div className="absolute left-1/2 top-8 z-10 hidden -translate-x-1/2 lg:block">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#ff6b2c] bg-[#f5f5f3]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#ff6b2c]" />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${isEven ? "" : "direction-rtl"}`}>
                    {/* Image side */}
                    <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                          src={imageSrc}
                          alt={step.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Content side */}
                    <div className={`${isEven ? "lg:order-2 lg:pl-16" : "lg:order-1 lg:pr-16 lg:text-right"}`}>
                      {/* Big number */}
                      <span className="font-display text-7xl font-black text-[#1a1a1a]/[0.04] md:text-8xl lg:text-9xl">
                        {step.number}
                      </span>

                      {/* Label */}
                      <div className={`-mt-8 mb-2 flex items-center gap-2 ${isEven ? "" : "lg:justify-end"}`}>
                        {/* Mobile dot */}
                        <div className="flex h-3 w-3 items-center justify-center rounded-full border border-[#ff6b2c] lg:hidden">
                          <div className="h-1 w-1 rounded-full bg-[#ff6b2c]" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#ff6b2c]">
                          {step.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl font-bold text-[#1a1a1a] md:text-3xl">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 leading-relaxed text-[#888888]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/proteinini-olustur"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b2c] px-10 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.3)]"
          >
            Paketini Oluştur &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
