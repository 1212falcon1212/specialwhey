"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCheckoutStore } from "@/stores/checkout-store";

export function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const orderNumber = useCheckoutStore((s) => s.orderNumber);
  const clear = useCheckoutStore((s) => s.clear);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      clear();
    }
  }, [mounted, clear]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[rgba(255,107,44,0.12)]">
          <CheckCircle2 className="size-10 text-[#ff6b2c]" />
        </div>

        <h1 className="font-display text-2xl font-bold text-[#ff6b2c]">
          Ödemeniz Başarıyla Tamamlandı!
        </h1>

        {orderNumber && (
          <p className="mt-3 text-muted-foreground">
            Sipariş numaranız:{" "}
            <span className="font-semibold text-foreground">
              {orderNumber}
            </span>
          </p>
        )}

        <p className="mt-2 text-sm text-muted-foreground">
          Siparişlerinizi hesabınızdan takip edebilirsiniz.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
            size="lg"
            render={<Link href="/hesabim/siparisler" />}
          >
            <ClipboardList className="size-4" />
            Siparişlerime Git
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            render={<Link href="/" />}
          >
            <ShoppingBag className="size-4" />
            Alışverişe Devam Et
          </Button>
        </div>
      </Card>
    </div>
  );
}
