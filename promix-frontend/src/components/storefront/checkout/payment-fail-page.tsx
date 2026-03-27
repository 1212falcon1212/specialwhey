"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCheckoutStore } from "@/stores/checkout-store";

export function PaymentFailPage() {
  const [mounted, setMounted] = useState(false);
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
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="size-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-red-700">Ödeme Başarısız</h1>

        <p className="mt-3 text-muted-foreground">
          Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
            size="lg"
            render={<Link href="/odeme" />}
          >
            <RefreshCw className="size-4" />
            Tekrar Dene
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            render={<Link href="/" />}
          >
            <Home className="size-4" />
            Ana Sayfa
          </Button>
        </div>
      </Card>
    </div>
  );
}
