"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { CartItemRow } from "./cart-item-row";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const isOpen = useCartStore((s) => s.isOpen);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const itemCount = totalItems();
  const total = totalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Sepetim
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} ürün)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <ShoppingCart className="size-12 text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium">Sepetiniz boş</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ürünleri keşfetmeye başlayın
              </p>
            </div>
            <Button
              className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
              onClick={() => setDrawerOpen(false)}
              render={<Link href="/urunler" />}
            >
              Ürünlere Göz At
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t p-4">
              <Separator className="mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Toplam</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDrawerOpen(false)}
                  render={<Link href="/sepet" />}
                >
                  Sepeti Görüntüle
                </Button>
                <Button
                  className="w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
                  onClick={() => setDrawerOpen(false)}
                  render={<Link href="/odeme" />}
                >
                  Ödemeye Geç
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
