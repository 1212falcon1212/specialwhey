"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";

export function PaymentPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const iframeUrl = useCheckoutStore((s) => s.iframeUrl);
  const orderNumber = useCheckoutStore((s) => s.orderNumber);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !iframeUrl) {
      router.replace("/odeme");
    }
  }, [mounted, iframeUrl, router]);

  // Clear cart since the order has been created
  useEffect(() => {
    if (mounted && iframeUrl) {
      clearCart();
    }
  }, [mounted, iframeUrl, clearCart]);

  // Load PayTR iframeResizer script
  useEffect(() => {
    if (!mounted || !iframeUrl) return;

    const script = document.createElement("script");
    script.src = "https://www.paytr.com/js/iframeResizer.min.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).iFrameResize({}, "#paytriframe");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [mounted, iframeUrl]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!iframeUrl) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <CreditCard className="size-6 text-[#ff6b2c]" />
        <div>
          <h1 className="text-2xl font-bold">Ödeme</h1>
          {orderNumber && (
            <p className="text-sm text-muted-foreground">
              Sipariş No: {orderNumber}
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <iframe
          src={iframeUrl}
          id="paytriframe"
          frameBorder="0"
          scrolling="no"
          style={{ width: "100%", minHeight: "400px" }}
        />
      </div>
    </div>
  );
}
