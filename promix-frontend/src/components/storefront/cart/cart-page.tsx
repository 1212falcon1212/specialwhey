"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartPage() {
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16">
        <div className="flex size-24 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="size-12 text-muted-foreground/50" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sepetiniz boş</h1>
          <p className="mt-2 text-muted-foreground">
            Henüz sepetinize ürün eklemediniz. Ürünlerimizi keşfetmeye
            başlayın.
          </p>
        </div>
        <Button
          className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
          size="lg"
          render={<Link href="/urunler" />}
        >
          <ShoppingBag className="size-4" />
          Ürünlere Göz At
        </Button>
      </div>
    );
  }

  const itemCount = totalItems();
  const total = totalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Sepetim
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({itemCount} ürün)
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="divide-y p-0">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3] sm:size-24">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      Görsel
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      {item.type === "mixer" && (
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-[rgba(255,107,44,0.12)] text-[#ff6b2c]"
                        >
                          Özel Karışım
                        </Badge>
                      )}
                      {item.type === "mixer" &&
                        item.mixerItems &&
                        item.mixerItems.length > 0 && (
                          <ul className="mt-1.5 space-y-0.5">
                            {item.mixerItems.map((mi, idx) => (
                              <li
                                key={`${mi.ingredientId}-${idx}`}
                                className="text-sm text-muted-foreground"
                              >
                                {mi.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Kaldır</span>
                    </Button>
                  </div>

                  {/* Price & Quantity */}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="size-3" />
                        <span className="sr-only">Azalt</span>
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3" />
                        <span className="sr-only">Arttır</span>
                      </Button>
                    </div>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCart}
            >
              <Trash2 className="size-3.5" />
              Sepeti Temizle
            </Button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kargo</span>
                <span className="text-[#ff6b2c]">Ücretsiz</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold">
              <span>Toplam</span>
              <span className="text-lg">{formatPrice(total)}</span>
            </div>

            <Button
              className="mt-6 w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
              size="lg"
              render={<Link href="/odeme" />}
            >
              Ödemeye Geç
              <ArrowRight className="size-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
