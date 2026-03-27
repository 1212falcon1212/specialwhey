"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import type { Category } from "@/types/ingredient";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data } = useApi<Category[]>("/storefront/categories");
  const categories = data?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parentCategories = categories.filter((c) => !c.parent_id);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-[#ff6b2c] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#e85a1e]"
      >
        <LayoutGrid className="size-4" />
        Tüm Kategoriler
        <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 flex min-w-[600px] overflow-hidden rounded-lg border border-[#eeeeee] bg-white shadow-xl">
          {/* Left: Category List */}
          <div className="w-56 shrink-0 border-r border-[#eeeeee] bg-[#f5f5f3] py-2">
            {parentCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onMouseEnter={() => setActiveCategory(category)}
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = `/urunler?kategori=${category.slug}`;
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                  activeCategory?.id === category.id
                    ? "bg-[rgba(255,107,44,0.08)] text-[#ff6b2c] font-medium"
                    : "text-[#666666] hover:bg-[#1a1a1a]/5"
                )}
              >
                <span>{category.name}</span>
                {category.children && category.children.length > 0 && (
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                )}
              </button>
            ))}

            <div className="mx-4 my-2 border-t" />

            <Link
              href="/urunler"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm font-medium text-[#ff6b2c] hover:text-[#e85a1e]"
            >
              Tüm Ürünleri Gör
            </Link>
          </div>

          {/* Right: Subcategories */}
          <div className="flex-1 p-6">
            {activeCategory ? (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  {activeCategory.name}
                </h3>
                {activeCategory.children && activeCategory.children.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {activeCategory.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/urunler?kategori=${child.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-[#888888] transition-colors hover:bg-[#1a1a1a]/5 hover:text-[#1a1a1a]"
                      >
                        {child.image && (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-[#f0f0ee]">
                            <Image src={child.image} alt={child.name} fill className="object-cover" sizes="40px" unoptimized />
                          </div>
                        )}
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {activeCategory.description ?? "Bu kategorideki ürünleri keşfedin."}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Detayları görmek için kategori üzerine gelin
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
