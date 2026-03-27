"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/storefront/products/product-grid";
import { usePaginatedApi } from "@/hooks/use-api";
import type { Ingredient } from "@/types/ingredient";

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryParam = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") ?? "";
    if (debouncedQuery === currentQ) return;
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const shouldFetch = debouncedQuery.length >= 2;
  const { data, isLoading } = usePaginatedApi<Ingredient>(
    shouldFetch ? `/storefront/search?q=${encodeURIComponent(debouncedQuery)}` : null,
  );

  const ingredients = data?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display mb-6 text-2xl font-bold text-foreground md:text-3xl">
        Arama
      </h1>

      <div className="mx-auto mb-8 max-w-xl">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            type="search"
            placeholder="Ürün ara..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>
      </div>

      {!shouldFetch && debouncedQuery.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
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
            className="mb-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <h3 className="text-lg font-semibold text-foreground">
            Ürün Arayın
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Arama yapmak için yukarıdaki alana bir şeyler yazın.
          </p>
        </div>
      )}

      {!shouldFetch && debouncedQuery.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Arama yapmak için en az 2 karakter girin.
          </p>
        </div>
      )}

      {shouldFetch && (
        <>
          {!isLoading && ingredients.length > 0 && (
            <p className="mb-4 text-sm text-muted-foreground">
              &quot;{debouncedQuery}&quot; için {data?.meta?.total ?? ingredients.length} sonuç
              bulundu.
            </p>
          )}
          <ProductGrid ingredients={ingredients} loading={isLoading} />
          {!isLoading && ingredients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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
                className="mb-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <h3 className="text-lg font-semibold text-foreground">
                Sonuç bulunamadı
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                &quot;{debouncedQuery}&quot; ile eşleşen ürün bulunamadı. Farklı
                bir arama terimi deneyin.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
