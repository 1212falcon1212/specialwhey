"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";
import type { Order } from "@/types/order";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "./order-status-badge";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

export function OrderListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePaginatedApi<Order>(
    `/account/orders?page=${page}`
  );

  const orders = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Siparişler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <ShoppingBag className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Henüz siparişiniz yok.
          </p>
          <Link href="/urunler">
            <Button className="mt-4" variant="outline">
              Alışverişe Başla
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/hesabim/siparislerim/${order.order_number}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          #{order.order_number}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>
                          {new Date(order.created_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                        {order.items && (
                          <span>{order.items.length} ürün</span>
                        )}
                        <span>
                          Ödeme:{" "}
                          {PAYMENT_STATUS_LABELS[order.payment_status] ??
                            order.payment_status}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-semibold text-[#ff6b2c]">
                        {formatPrice(order.total)}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <span className="text-sm text-muted-foreground">
                {meta.current_page} / {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
