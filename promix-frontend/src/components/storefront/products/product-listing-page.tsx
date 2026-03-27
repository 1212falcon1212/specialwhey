"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useApi, usePaginatedApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductGrid } from "@/components/storefront/products/product-grid";
import { CategoryFilterSidebar } from "@/components/storefront/products/category-filter-sidebar";
import { ProductSortSelect } from "@/components/storefront/products/product-sort-select";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/ingredient";
import type { Ingredient } from "@/types/ingredient";

export function ProductListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("kategori");
  const sortBy = searchParams.get("siralama") ?? "sort_order";
  const currentPage = Number(searchParams.get("sayfa") ?? "1");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/urunler?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleCategorySelect = useCallback(
    (slug: string | null) => {
      updateParams({ kategori: slug, sayfa: null });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      updateParams({ siralama: value === "sort_order" ? null : value, sayfa: null });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ sayfa: page === 1 ? null : String(page) });
    },
    [updateParams]
  );

  const ingredientsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category_slug", selectedCategory);
    if (sortBy !== "sort_order") params.set("sort_by", sortBy);
    params.set("page", String(currentPage));
    return `/storefront/ingredients?${params.toString()}`;
  }, [selectedCategory, sortBy, currentPage]);

  const {
    data: categoriesResponse,
    error: categoriesError,
  } = useApi<Category[]>("/storefront/categories");

  const {
    data: ingredientsResponse,
    error: ingredientsError,
    isLoading: ingredientsLoading,
  } = usePaginatedApi<Ingredient>(ingredientsUrl);

  const categories = categoriesResponse?.data ?? [];
  const ingredients = ingredientsResponse?.data ?? [];
  const meta = ingredientsResponse?.meta;

  // Find selected category name for breadcrumb
  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : null;

  if (categoriesError || ingredientsError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-destructive">Bir hata oluştu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ürünler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Sayfayı Yenile
        </Button>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!meta) return [];
    const pages: (number | "...")[] = [];
    const total = meta.last_page;
    const current = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-3.5" />
          Anasayfa
        </Link>
        <span>/</span>
        {selectedCategoryName ? (
          <>
            <Link href="/urunler" className="transition-colors hover:text-foreground">
              Ürünler
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{selectedCategoryName}</span>
          </>
        ) : (
          <span className="font-medium text-foreground">Ürünler</span>
        )}
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {selectedCategoryName ?? "Ürünler"}
        </h1>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <CategoryFilterSidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" size="sm" className="lg:hidden" />}
              >
                <SlidersHorizontal className="mr-1.5 size-4" />
                Filtrele
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <CategoryFilterSidebar
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={handleCategorySelect}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Results count */}
            <div className="hidden text-sm text-muted-foreground lg:block">
              {meta && !ingredientsLoading && (
                <span>{meta.total} ürün bulundu</span>
              )}
            </div>

            {/* Sort */}
            <div className="ml-auto">
              <ProductSortSelect value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid ingredients={ingredients} loading={ingredientsLoading} />

          {/* Numbered Pagination */}
          {meta && meta.last_page > 1 && !ingredientsLoading && (
            <div className="mt-8 flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "size-9",
                      currentPage === page && "bg-[#ff6b2c] hover:bg-[#e85a1e]"
                    )}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                disabled={currentPage >= meta.last_page}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
