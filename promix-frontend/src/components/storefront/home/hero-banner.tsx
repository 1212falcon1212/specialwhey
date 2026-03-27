"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/ingredient";

import "swiper/css";
import "swiper/css/pagination";

const DEMO_BANNERS: Banner[] = [
  {
    id: -1,
    title: "Kendi Protein Karışımını Oluştur",
    subtitle: "50+ bileşen, sınırsız kombinasyon. Seçimini yap, paketini al.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1400&q=80&auto=format",
    mobile_image: null,
    link: "/proteinini-olustur",
    button_text: "Hemen Başla",
    position: "hero",
  },
  {
    id: -2,
    title: "Kaliteli Bileşenler, Hızlı Teslimat",
    subtitle: "Seçtiğin bileşenler ayrı ayrı paketlenip hızlıca kargoya verilir.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673c33d5?w=1400&q=80&auto=format",
    mobile_image: null,
    link: "/proteinini-olustur",
    button_text: "Keşfet",
    position: "hero",
  },
] as unknown as Banner[];

export function HeroBanner() {
  const { data, isLoading } = useApi<Banner[]>("/storefront/banners?position=hero");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[70vh] min-h-[500px] w-full" />;
  }

  const apiBanners = data?.data;
  const banners = apiBanners && apiBanners.length > 0 ? apiBanners : DEMO_BANNERS;

  return (
    <section className="relative">
      {/* Banner Carousel — full viewport height background */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        className="hero-combined-swiper"
      >
        {banners.map((banner) => {
          const imageSrc = isMobile && banner.mobile_image ? banner.mobile_image : banner.image;
          return (
            <SwiperSlide key={banner.id}>
              <div className="relative flex min-h-[70vh] items-center justify-center md:min-h-[80vh]">
                {/* Background image */}
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2218]" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content — centered over image */}
                <div className="relative z-10 px-4 text-center">
                  <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
                    Bileşenleri{" "}
                    <span className="bg-gradient-to-r from-[#ff6b2c] to-[#ff9a5c] bg-clip-text text-transparent">
                      Sen Seç
                    </span>
                    <br />
                    Paketini Biz Gönderelim
                  </h1>

                  <p className="mx-auto mt-5 max-w-xl text-base text-white/60 md:text-lg">
                    Protein bazını, aromayı ve ekstra bileşenleri kendin belirle.
                    Seçtiğin bileşenler özel paketlerle kapına gelsin.
                  </p>

                  <Link
                    href="/proteinini-olustur"
                    className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b2c] px-10 text-base font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.35)]"
                  >
                    Karışımını Oluştur &rarr;
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .hero-combined-swiper .swiper-pagination {
          bottom: 24px !important;
        }
        .hero-combined-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.4;
          width: 10px;
          height: 10px;
        }
        .hero-combined-swiper .swiper-pagination-bullet-active {
          background: #ff6b2c;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
