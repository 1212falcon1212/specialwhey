"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { mutate } from "swr";
import type { Order } from "@/types/order";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "./order-status-badge";
import { RefundRequestDialog } from "./refund-request-dialog";
import { ArrowLeft, RotateCcw } from "lucide-react";

export function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const { data, isLoading, error } = useApi<Order>(
    `/account/orders/${params.orderNumber}`
  );
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-6 w-24" />
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Sipariş bulunamadı veya bir hata oluştu.
        </div>
        <div className="mt-4 text-center">
          <Link href="/hesabim/siparislerim">
            <Button variant="outline">
              <ArrowLeft className="mr-1 size-4" />
              Siparişlerime Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canRequestRefund =
    order.status === "delivered" || order.status === "shipped";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/hesabim/siparislerim"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 size-4" />
        Siparişlerime Dön
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Sipariş #{order.order_number}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Badge className="rounded-md border-0 bg-[#f5f5f3] text-xs text-[#555555]">
            Ödeme: {PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status}
          </Badge>
          {canRequestRefund && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefundDialogOpen(true)}
            >
              <RotateCcw className="mr-1 size-4" />
              İade Talebi Oluştur
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sipariş Kalemleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {item.type === "mixer"
                        ? "Özel Karışım"
                        : item.mixer_snapshot
                          ? (item.mixer_snapshot as Record<string, string>)
                              .name ?? "Ürün"
                          : `Ürün #${item.ingredient_id}`}
                    </p>
                    {item.type === "mixer" && item.mixer_snapshot && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Array.isArray(
                          (
                            item.mixer_snapshot as Record<
                              string,
                              unknown[]
                            >
                          ).items
                        ) &&
                          (
                            (
                              item.mixer_snapshot as Record<
                                string,
                                Array<{ name?: string; amount?: number }>
                              >
                            ).items
                          ).map((sub, idx) => (
                            <span key={idx}>
                              {sub.name}
                              {sub.amount ? ` (${sub.amount}g)` : ""}
                              {idx <
                              (
                                (
                                  item.mixer_snapshot as Record<
                                    string,
                                    unknown[]
                                  >
                                ).items
                              ).length -
                                1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                      </div>
                    )}
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {formatPrice(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <div className="grid gap-4 sm:grid-cols-2">
          {order.billing_address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fatura Adresi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">
                  {order.billing_address.full_name}
                </p>
                <p>{order.billing_address.phone}</p>
                <p>{order.billing_address.address_line}</p>
                <p>
                  {order.billing_address.district} /{" "}
                  {order.billing_address.city}
                  {order.billing_address.zip_code
                    ? ` - ${order.billing_address.zip_code}`
                    : ""}
                </p>
              </CardContent>
            </Card>
          )}

          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teslimat Adresi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">
                  {order.shipping_address.full_name}
                </p>
                <p>{order.shipping_address.phone}</p>
                <p>{order.shipping_address.address_line}</p>
                <p>
                  {order.shipping_address.district} /{" "}
                  {order.shipping_address.city}
                  {order.shipping_address.zip_code
                    ? ` - ${order.shipping_address.zip_code}`
                    : ""}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Totals */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">İndirim</span>
                  <span className="text-[#ff6b2c]">
                    -{formatPrice(order.discount_amount)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Toplam</span>
                <span className="text-[#ff6b2c]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sipariş Notu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Refund Dialog */}
      {canRequestRefund && (
        <RefundRequestDialog
          orderId={order.id}
          open={refundDialogOpen}
          onOpenChange={setRefundDialogOpen}
          onSuccess={() =>
            mutate(`/account/orders/${params.orderNumber}`)
          }
        />
      )}
    </div>
  );
}
