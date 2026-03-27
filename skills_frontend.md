# Skill: Next.js Frontend Geliştirme - ProMix

## Bu Skill Ne Zaman Kullanılır?
Frontend'de yeni sayfa, component, hook, store veya API entegrasyonu oluştururken.

---

## Sayfa Oluşturma Şablonu (Server Component)

```tsx
// src/app/(storefront)/urunler/page.tsx
import { Metadata } from "next";
import { IngredientList } from "@/components/storefront/ingredient-list";

export const metadata: Metadata = {
  title: "Ürünler | ProMix",
  description: "Protein tozları, aminoasitler ve sporcu gıdaları. Kendi karışımını oluştur.",
  openGraph: {
    title: "Ürünler | ProMix",
    description: "Protein tozları, aminoasitler ve sporcu gıdaları.",
  },
};

export default function UrunlerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 md:text-3xl">Ürünler</h1>
      <IngredientList />
    </main>
  );
}
```

## Client Component Şablonu

```tsx
// src/components/storefront/ingredient-list.tsx
"use client";

import { useState } from "react";
import { useIngredients } from "@/hooks/use-ingredients";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function IngredientList() {
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, error } = useIngredients({
    categoryId,
    sortBy,
  });

  if (error) {
    return <EmptyState title="Bir hata oluştu" description="Lütfen tekrar deneyin." />;
  }

  return (
    <div>
      {/* Filtreler */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {/* Kategoriler dinamik */}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="price_asc">Fiyat: Düşükten Yükseğe</SelectItem>
            <SelectItem value="price_desc">Fiyat: Yüksekten Düşüğe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <EmptyState title="Ürün bulunamadı" description="Farklı filtreler deneyin." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data?.map((ingredient) => (
            <ProductCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Custom Hook Şablonu (SWR)

```tsx
// src/hooks/use-ingredients.ts
import useSWR from "swr";
import { api } from "@/lib/api";
import type { Ingredient, PaginatedResponse } from "@/types/api";

interface UseIngredientsParams {
  categoryId?: string;
  sortBy?: string;
  page?: number;
  perPage?: number;
}

export function useIngredients(params?: UseIngredientsParams) {
  const searchParams = new URLSearchParams();

  if (params?.categoryId && params.categoryId !== "all") {
    searchParams.set("category_id", params.categoryId);
  }
  if (params?.sortBy) searchParams.set("sort_by", params.sortBy);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("per_page", String(params.perPage));

  const queryString = searchParams.toString();
  const key = `/ingredients${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Ingredient>>(
    key,
    async (url: string) => {
      const response = await api.get(url);
      return response.data;
    }
  );

  return {
    data: data?.data,
    meta: data?.meta,
    error,
    isLoading,
    mutate,
  };
}
```

## Zustand Store Şablonu

```tsx
// src/stores/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Cart drawer

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "promix-cart",
      // SSR uyumluluğu için
      skipHydration: true,
    }
  )
);
```

## API Client Şablonu

```tsx
// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Token ekle
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: Error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
        window.location.href = "/giris";
      }
    }
    return Promise.reject(error);
  }
);
```

## TypeScript Type Şablonları

```tsx
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// src/types/ingredient.ts
export interface Ingredient {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image: string | null;
  gallery: string[];
  base_price: number;
  unit: "gram" | "ml" | "adet";
  unit_amount: number;
  stock_quantity: number;
  sku: string | null;
  nutritional_info: NutritionalInfo | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  category?: Category;
  options?: IngredientOption[];
}

export interface IngredientOption {
  id: number;
  ingredient_id: number;
  label: string;
  amount: number;
  price: number;
  stock_quantity: number;
  is_default: boolean;
  sort_order: number;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  [key: string]: number | undefined;
}

// src/types/cart.ts
export interface CartItem {
  id: string; // unique key (ingredient_optionId veya mixer_hash)
  type: "ingredient" | "mixer";
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  ingredientId?: number;
  optionId?: number;
  mixerItems?: MixerCartItem[];
}

export interface MixerCartItem {
  ingredientId: number;
  optionId?: number;
  name: string;
  price: number;
}
```

## Admin DataTable Şablonu

```tsx
// Admin'de tablo oluştururken bu pattern'i kullan
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { ColumnDef } from "@tanstack/react-table";

// Kolon tanımları
const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "image",
    header: "Görsel",
    cell: ({ row }) => (
      <img
        src={row.original.image || "/placeholder.png"}
        alt={row.original.name}
        className="h-10 w-10 rounded object-cover"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Bileşen Adı",
  },
  {
    accessorKey: "base_price",
    header: "Fiyat",
    cell: ({ row }) => `₺${row.original.base_price.toFixed(2)}`,
  },
  {
    accessorKey: "is_active",
    header: "Durum",
    cell: ({ row }) => (
      <span className={row.original.is_active ? "text-green-600" : "text-red-600"}>
        {row.original.is_active ? "Aktif" : "Pasif"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
```

## Fiyat Formatlama Utility

```tsx
// src/lib/utils.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(price);
}

// Kullanım: formatPrice(149.90) → "₺149,90"
```

## Mixer Wizard State Yapısı

```tsx
// src/stores/mixer-store.ts
interface MixerState {
  currentStep: number;
  selectedProtein: SelectedItem | null;
  selectedFlavor: SelectedItem | null;
  selectedExtras: SelectedItem[];
  totalPrice: number;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectProtein: (item: SelectedItem) => void;
  selectFlavor: (item: SelectedItem) => void;
  toggleExtra: (item: SelectedItem) => void;
  calculateTotal: () => void;
  reset: () => void;
  toCartItem: () => CartItem;
}

interface SelectedItem {
  ingredientId: number;
  optionId?: number;
  name: string;
  price: number;
  image?: string;
}
```

## Responsive Tasarım Kuralları

Her component Mobile First yaklaşımı ile:
```tsx
// Mobil önce, sonra büyük ekranlar
<div className="
  grid grid-cols-2 gap-3           // Mobil: 2 kolon, küçük boşluk
  sm:grid-cols-2 sm:gap-4          // Tablet: 2 kolon, orta boşluk
  md:grid-cols-3                   // Desktop: 3 kolon
  lg:grid-cols-4 lg:gap-6          // Büyük: 4 kolon, geniş boşluk
">

// Fixed bottom bar (mobilde sepet veya fiyat çubuğu)
<div className="
  fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4
  md:hidden                         // Desktop'ta gizle
">

// Sidebar filtre (mobilde drawer, desktop'ta sabit)
<aside className="
  hidden                            // Mobilde gizle
  md:block md:w-64 md:shrink-0     // Desktop'ta göster
">
```

## Loading State Kuralları

Her veri çeken component'te skeleton veya spinner olmalı:
```tsx
// Skeleton loader
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-4">
      <div className="mb-3 aspect-square rounded bg-gray-200" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
    </div>
  );
}
```
