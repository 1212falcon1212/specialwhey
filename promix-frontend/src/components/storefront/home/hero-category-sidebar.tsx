"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types/ingredient";

export function HeroCategorySidebar() {
  const { data, isLoading } = useApi<Category[]>("/storefront/categories");
  const categories = data?.data ?? [];
  const parentCategories = categories.filter((c) => !c.parent_id).slice(0, 8);

  return (
    <div className="flex h-[400px] flex-col rounded-lg border border-[#eeeeee] bg-white">
      <div className="border-b border-[#eeeeee] px-4 py-3">
        <h3 className="font-display text-sm font-semibold text-[#1a1a1a]">Kategoriler</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : (
          parentCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/urunler?kategori=${cat.slug}`}
              className="flex items-center justify-between px-4 py-2 text-sm text-[#666666] transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff6b2c]"
            >
              <span>{cat.name}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          ))
        )}
      </div>
      <div className="border-t border-[#eeeeee] py-1">
        <Link href="/urunler?siralama=best_seller" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff6b2c]">
          <TrendingUp className="size-3.5" />
          Çok Satanlar
        </Link>
        <Link href="/urunler?siralama=newest" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#666666] transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#ff6b2c]">
          <Sparkles className="size-3.5" />
          Yeni Ürünler
        </Link>
      </div>
    </div>
  );
}
