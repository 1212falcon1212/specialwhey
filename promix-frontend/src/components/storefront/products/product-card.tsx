"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Ingredient } from "@/types/ingredient";

interface ProductCardProps {
  ingredient: Ingredient;
}

export function ProductCard({ ingredient }: ProductCardProps) {
  const minOptionPrice =
    ingredient.options && ingredient.options.length > 0
      ? Math.min(...ingredient.options.map((o) => o.price))
      : null;

  const optionLabels = ingredient.options?.slice(0, 3).map((o) => o.label) ?? [];

  return (
    <Link href={`/urunler/${ingredient.slug}`} className="group block">
      <Card className="h-full overflow-hidden border transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,107,44,0.12)]">
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
          {ingredient.image ? (
            <Image
              src={ingredient.image}
              alt={ingredient.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {ingredient.is_featured && (
              <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 hover:bg-orange-500">
                Öne Çıkan
              </Badge>
            )}
          </div>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 opacity-0 shadow-sm transition-all hover:bg-white group-hover:opacity-100"
          >
            <Heart className="size-4 text-white/60" />
          </button>
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 p-3">
          {/* Category */}
          {ingredient.category && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {ingredient.category.name}
            </span>
          )}

          {/* Name */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
            {ingredient.name}
          </h3>

          {/* Option pills */}
          {optionLabels.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {optionLabels.map((label) => (
                <span
                  key={label}
                  className="rounded bg-[#f5f5f3] px-1.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-auto pt-2">
            {minOptionPrice !== null ? (
              <p className="text-sm font-bold text-[#ff6b2c]">
                {formatPrice(minOptionPrice)}
                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                  {"'den başlayan"}
                </span>
              </p>
            ) : (
              <p className="text-sm font-bold text-[#ff6b2c]">
                {formatPrice(ingredient.base_price)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
