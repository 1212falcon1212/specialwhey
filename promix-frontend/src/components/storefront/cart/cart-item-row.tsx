"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-3">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[#f5f5f3]">
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
            <p className="truncate text-sm font-medium">{item.name}</p>
            {item.type === "mixer" && (
              <Badge
                variant="secondary"
                className="mt-1 bg-[rgba(255,107,44,0.12)] text-[#ff6b2c]"
              >
                Özel Karışım
              </Badge>
            )}
            {item.type === "mixer" && item.mixerItems && item.mixerItems.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {item.mixerItems.map((mi, idx) => (
                  <li
                    key={`${mi.ingredientId}-${idx}`}
                    className="text-xs text-muted-foreground"
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
            <Trash2 className="size-3.5" />
            <span className="sr-only">Kaldır</span>
          </Button>
        </div>

        {/* Price & Quantity */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="size-3" />
              <span className="sr-only">Azalt</span>
            </Button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="size-3" />
              <span className="sr-only">Arttır</span>
            </Button>
          </div>
          <span className="text-sm font-semibold">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
