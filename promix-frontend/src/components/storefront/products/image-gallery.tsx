"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted">
        <ImageIcon className="size-16 text-muted-foreground" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl bg-muted">
        <div className="relative aspect-square w-full">
          <Image
            src={images[0]}
            alt={name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image Swiper */}
      <div className="overflow-hidden rounded-xl bg-muted">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation
          onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
          className="aspect-square w-full [&_.swiper-button-next]:text-[#ff6b2c] [&_.swiper-button-prev]:text-[#ff6b2c]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square w-full">
                <Image
                  src={image}
                  alt={`${name} - ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Strip */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        slidesPerView={Math.min(images.length, 5)}
        spaceBetween={8}
        watchSlidesProgress
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="cursor-pointer">
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                selectedIndex === index
                  ? "border-[#ff6b2c]"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
