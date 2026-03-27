"use client";

import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Banner } from "@/types/ingredient";

function GalleryCard({ banner, isLarge }: { banner: Banner; isLarge: boolean }) {
  const content = (
    <>
      {banner.image && (
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={isLarge ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <h3
          className={`font-display font-bold leading-tight text-white ${
            isLarge ? "text-2xl lg:text-3xl" : "text-base lg:text-lg"
          }`}
        >
          {banner.title}
        </h3>
        {banner.subtitle && isLarge && (
          <p className="mt-1.5 text-sm text-white/70 line-clamp-2">
            {banner.subtitle}
          </p>
        )}
      </div>
    </>
  );

  const className = `group relative overflow-hidden rounded-2xl bg-[#f0f0ee] ${
    isLarge ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-[4/5]"
  }`;

  if (banner.link) {
    return (
      <Link href={banner.link} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export function LifestyleGallery() {
  const { data, isLoading } = useApi<Banner[]>(
    "/storefront/banners?position=lifestyle"
  );
  const DEMO_LIFESTYLE = [
    {
      id: -1,
      title: "Güçlü Başla, Güçlü Kal",
      subtitle: "Antrenman öncesi ve sonrası doğru beslenme ile farkı hisset.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format",
      mobile_image: null, link: "/proteinini-olustur", button_text: null,
      position: "lifestyle" as const,
    },
    {
      id: -2,
      title: "Doğal Bileşenler",
      subtitle: null,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&auto=format",
      mobile_image: null, link: null, button_text: null,
      position: "lifestyle" as const,
    },
    {
      id: -3,
      title: "Performans Odaklı",
      subtitle: null,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80&auto=format",
      mobile_image: null, link: null, button_text: null,
      position: "lifestyle" as const,
    },
    {
      id: -4,
      title: "Sağlıklı Yaşam",
      subtitle: null,
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80&auto=format",
      mobile_image: null, link: null, button_text: null,
      position: "lifestyle" as const,
    },
    {
      id: -5,
      title: "Hedefine Ulaş",
      subtitle: null,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&auto=format",
      mobile_image: null, link: null, button_text: null,
      position: "lifestyle" as const,
    },
  ] as unknown as Banner[];

  const apiBanners = data?.data ?? [];
  const banners = apiBanners.length > 0 ? apiBanners : DEMO_LIFESTYLE;

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/5]"}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const slots = banners.slice(0, 5);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {slots.map((banner, i) => (
            <GalleryCard key={banner.id} banner={banner} isLarge={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
