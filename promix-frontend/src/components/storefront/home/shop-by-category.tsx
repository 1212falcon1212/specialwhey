"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useApi } from "@/hooks/use-api";
import { SectionHeader } from "@/components/storefront/shared/section-header";
import { CategoryCardSkeleton } from "@/components/storefront/shared/skeletons";
import type { Category } from "@/types/ingredient";

import "swiper/css";

export function ShopByCategory() {
  const { data, isLoading } = useApi<Category[]>("/storefront/categories");
  const categories = (data?.data ?? []).filter((c) => !c.parent_id);

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <SectionHeader title="KATEGORİLERE" boldTitle="GÖZ AT" viewAllHref="/urunler" viewAllText="Tüm Kategoriler" />
        <div className="mt-8">
          {isLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0">
                  <CategoryCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              spaceBetween={16}
              slidesPerView={3}
              breakpoints={{
                480: { slidesPerView: 4 },
                640: { slidesPerView: 5 },
                768: { slidesPerView: 6 },
                1024: { slidesPerView: 7 },
                1280: { slidesPerView: 8 },
              }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <Link href={`/urunler?kategori=${category.slug}`} className="group flex flex-col items-center gap-3">
                    <div className="relative size-20 overflow-hidden rounded-full border-2 border-transparent bg-[#f5f5f3] transition-all group-hover:border-[#ff6b2c] sm:size-24">
                      {category.image ? (
                        <Image src={category.image} alt={category.name} fill className="object-cover" sizes="96px" unoptimized />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl font-bold text-[#888888]">
                          {category.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-center text-xs font-medium text-[#666666] transition-colors group-hover:text-[#1a1a1a] sm:text-sm">
                      {category.name}
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
