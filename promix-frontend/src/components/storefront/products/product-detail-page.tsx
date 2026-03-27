"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Home, ShoppingCart, Heart, Check, X } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useCartStore } from "@/stores/cart-store";
import type { Ingredient, IngredientOption } from "@/types/ingredient";
import type { CartItem } from "@/types/cart";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ImageGallery } from "./image-gallery";
import { OptionSelector } from "./option-selector";
import { NutritionalInfoTable } from "./nutritional-info-table";
import { TrustBadges } from "./trust-badges";
import { RelatedProducts } from "./related-products";
import { QuantitySelector } from "./quantity-selector";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <div className="pt-4">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
          <Skeleton className="mt-4 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailError({ message }: { message: string }) {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-10">
      <p className="text-lg font-medium text-destructive">{message}</p>
      <Button variant="outline" className="mt-4" render={<Link href="/urunler" />}>
        Ürünlere Dön
      </Button>
    </div>
  );
}

export function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const { data, error, isLoading } = useApi<Ingredient>(
    `/storefront/ingredients/${slug}`
  );
  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  const ingredient = data?.data;

  const [selectedOption, setSelectedOption] = useState<IngredientOption | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (ingredient?.options && ingredient.options.length > 0) {
      const defaultOption = ingredient.options.find((o) => o.is_default);
      setSelectedOption(defaultOption ?? ingredient.options[0]);
    }
  }, [ingredient]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <ProductDetailError message="Ürün yüklenirken bir hata oluştu." />;
  if (!ingredient) return <ProductDetailError message="Ürün bulunamadı." />;

  const currentPrice = selectedOption ? selectedOption.price : ingredient.base_price;
  const allImages =
    ingredient.gallery && ingredient.gallery.length > 0
      ? ingredient.gallery
      : ingredient.image
        ? [ingredient.image]
        : [];
  const isOutOfStock = selectedOption
    ? selectedOption.stock_quantity <= 0
    : ingredient.stock_quantity <= 0;
  const maxStock = selectedOption
    ? selectedOption.stock_quantity
    : ingredient.stock_quantity;

  function handleAddToCart() {
    if (!ingredient) return;
    const cartItem: CartItem = {
      id: `ing_${ingredient.id}_${selectedOption?.id ?? "base"}`,
      type: "ingredient",
      name: selectedOption
        ? `${ingredient.name} - ${selectedOption.label}`
        : ingredient.name,
      image: ingredient.image,
      price: currentPrice,
      quantity,
      ingredientId: ingredient.id,
      optionId: selectedOption?.id,
    };
    addItem(cartItem);
    setDrawerOpen(true);
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <Home className="size-3.5" />
          Anasayfa
        </Link>
        <span>/</span>
        {ingredient.category ? (
          <>
            <Link
              href={`/urunler?kategori=${ingredient.category.slug}`}
              className="transition-colors hover:text-foreground"
            >
              {ingredient.category.name}
            </Link>
            <span>/</span>
          </>
        ) : (
          <>
            <Link href="/urunler" className="transition-colors hover:text-foreground">
              Ürünler
            </Link>
            <span>/</span>
          </>
        )}
        <span className="line-clamp-1 font-medium text-foreground">{ingredient.name}</span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image Gallery */}
        <ImageGallery images={allImages} name={ingredient.name} />

        {/* Right: Product Details */}
        <div className="space-y-4">
          {/* Category */}
          {ingredient.category && (
            <Link href={`/urunler?kategori=${ingredient.category.slug}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer text-xs hover:bg-secondary/80"
              >
                {ingredient.category.name}
              </Badge>
            </Link>
          )}

          {/* Product Name */}
          <h1 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
            {ingredient.name}
          </h1>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="gap-1">
                <X className="size-3" />
                Stokta Yok
              </Badge>
            ) : (
              <Badge className="gap-1 bg-[rgba(255,107,44,0.12)] text-[#e85a1e] hover:bg-[rgba(255,107,44,0.12)]">
                <Check className="size-3" />
                Stokta Var
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#ff6b2c]">
              {formatPrice(currentPrice)}
            </span>
          </div>

          {/* Short Description */}
          {ingredient.short_description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ingredient.short_description}
            </p>
          )}

          <Separator />

          {/* Option Selector */}
          {ingredient.options && ingredient.options.length > 0 && (
            <OptionSelector
              options={ingredient.options}
              selected={selectedOption}
              onSelect={setSelectedOption}
            />
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Adet</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={maxStock}
            />
          </div>

          {/* Add to Cart + Wishlist */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 bg-[#ff6b2c] text-white hover:bg-[#e85a1e]",
                isOutOfStock && "opacity-50"
              )}
            >
              <ShoppingCart className="size-4" />
              {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Heart className="size-5" />
            </Button>
          </div>

          {/* Buy Now */}
          <Button
            variant="outline"
            size="lg"
            disabled={isOutOfStock}
            onClick={() => {
              handleAddToCart();
              window.location.href = "/sepet";
            }}
            className="w-full"
          >
            Hemen Satın Al
          </Button>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList variant="line">
            <TabsTrigger value="description">Açıklama</TabsTrigger>
            <TabsTrigger value="nutritional">Besin Değerleri</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            {ingredient.description ? (
              <div
                className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground"
                dangerouslySetInnerHTML={{ __html: ingredient.description }}
              />
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Bu ürün için açıklama bulunmamaktadır.
              </p>
            )}
          </TabsContent>
          <TabsContent value="nutritional" className="pt-6">
            <NutritionalInfoTable info={ingredient.nutritional_info} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {ingredient.category && (
        <RelatedProducts
          categorySlug={ingredient.category.slug}
          excludeId={ingredient.id}
        />
      )}
    </div>
  );
}
