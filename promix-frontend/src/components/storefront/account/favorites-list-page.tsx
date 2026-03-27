"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePaginatedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { mutate } from "swr";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { Ingredient } from "@/types/ingredient";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag } from "lucide-react";

interface FavoriteItem {
  id: number;
  ingredient_id: number;
  ingredient: Ingredient;
}

export function FavoritesListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePaginatedApi<FavoriteItem>(
    `/account/favorites?page=${page}`
  );
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const favorites = data?.data ?? [];
  const meta = data?.meta;

  async function handleRemove(ingredientId: number) {
    setRemovingIds((prev) => new Set(prev).add(ingredientId));
    try {
      await api.post(`/account/favorites/${ingredientId}/toggle`);
      toast.success("Ürün favorilerden çıkarıldı");
      mutate(`/account/favorites?page=${page}`);
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(ingredientId);
        return next;
      });
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Favoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Favorilerim</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <Heart className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Henüz favori ürününüz yok.
          </p>
          <Link href="/urunler">
            <Button className="mt-4" variant="outline">
              <ShoppingBag className="mr-1 size-4" />
              Ürünlere Göz At
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((fav) => {
              const ingredient = fav.ingredient;
              const minPrice =
                ingredient.options && ingredient.options.length > 0
                  ? Math.min(...ingredient.options.map((o) => o.price))
                  : ingredient.base_price;

              return (
                <Card key={fav.id} className="group relative overflow-hidden">
                  <Link href={`/urunler/${ingredient.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
                      {ingredient.image ? (
                        <Image
                          src={ingredient.image}
                          alt={ingredient.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="size-12" />
                        </div>
                      )}
                      {ingredient.category && (
                        <div className="absolute right-2 top-2">
                          <Badge variant="secondary">
                            {ingredient.category.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-3">
                    <Link href={`/urunler/${ingredient.slug}`}>
                      <h3 className="line-clamp-1 font-semibold">
                        {ingredient.name}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-[#ff6b2c]">
                        {formatPrice(minPrice)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemove(ingredient.id)}
                        disabled={removingIds.has(ingredient.id)}
                      >
                        <Heart className="size-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <span className="text-sm text-muted-foreground">
                {meta.current_page} / {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
