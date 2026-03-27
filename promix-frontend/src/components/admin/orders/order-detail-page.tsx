"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusUpdate } from "./order-status-update";
import { formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
} from "@/lib/constants";
import type { Order, OrderItem, OrderAddress, RefundRequest } from "@/types/order";
import { ArrowLeft } from "lucide-react";

interface AdminOrderDetail extends Order {
  user?: { id: number; name: string; email: string; phone: string | null };
  payments?: Array<{
    id: number;
    method: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
  refund_requests?: RefundRequest[];
}

export function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error, mutate } = useApi<AdminOrderDetail>(
    `/admin/orders/${params.id}`,
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Sipariş bulunamadı.</p>
        <Button variant="outline" onClick={() => router.push("/admin/siparisler")}>
          Geri Dön
        </Button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/siparisler")}
          >
            <ArrowLeft className="mr-1 size-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">
            Sipariş #{order.order_number}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={ORDER_STATUS_COLORS[order.status] ?? ""}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
          <Badge variant="outline">
            {PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Sipariş No</dt>
                  <dd className="font-medium">#{order.order_number}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Tarih</dt>
                  <dd className="font-medium">
                    {new Date(order.created_at).toLocaleString("tr-TR")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Durum</dt>
                  <dd>
                    <Badge className={ORDER_STATUS_COLORS[order.status] ?? ""}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Ödeme Yöntemi</dt>
                  <dd className="font-medium">{order.payment_method}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Ödeme Durumu</dt>
                  <dd>
                    <Badge variant="outline">
                      {PAYMENT_STATUS_LABELS[order.payment_status] ??
                        order.payment_status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Toplam</dt>
                  <dd className="text-lg font-bold text-emerald-600">
                    {formatPrice(order.total)}
                  </dd>
                </div>
              </dl>
              {order.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Müşteri Notu
                    </dt>
                    <dd className="mt-1 text-sm">{order.notes}</dd>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead className="text-right">Adet</TableHead>
                    <TableHead className="text-right">Birim Fiyat</TableHead>
                    <TableHead className="text-right">Toplam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {item.type === "mixer"
                              ? "Özel Karışım"
                              : `Bileşen #${item.ingredient_id}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.type === "mixer" ? "Mixer" : "Bileşen"}
                          </div>
                          {item.type === "mixer" && item.mixer_snapshot && (
                            <MixerSnapshotDisplay
                              snapshot={item.mixer_snapshot}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(item.total_price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-16 text-center text-muted-foreground"
                      >
                        Ürün bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Separator className="my-3" />
              <div className="flex flex-col items-end gap-1 text-sm">
                <div className="flex gap-8">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex gap-8">
                    <span className="text-muted-foreground">İndirim</span>
                    <span className="text-red-600">
                      -{formatPrice(order.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex gap-8 text-base font-bold">
                  <span>Toplam</span>
                  <span className="text-emerald-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <OrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.payment_status}
            onUpdate={() => mutate()}
          />

          {/* Refund Requests */}
          {order.refund_requests && order.refund_requests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>İade Talepleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.refund_requests.map((refund) => (
                    <div
                      key={refund.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {refund.reason_label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(refund.refund_amount)} -{" "}
                          {new Date(refund.created_at).toLocaleDateString(
                            "tr-TR",
                          )}
                        </p>
                      </div>
                      <Badge
                        className={
                          REFUND_STATUS_COLORS[refund.status] ?? ""
                        }
                      >
                        {REFUND_STATUS_LABELS[refund.status] ?? refund.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri</CardTitle>
            </CardHeader>
            <CardContent>
              {order.user ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Ad Soyad</dt>
                    <dd className="font-medium">
                      <Link
                        href={`/admin/musteriler/${order.user.id}`}
                        className="text-emerald-600 hover:underline"
                      >
                        {order.user.name}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">E-posta</dt>
                    <dd className="text-sm">{order.user.email}</dd>
                  </div>
                  {order.user.phone && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Telefon</dt>
                      <dd className="text-sm">{order.user.phone}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Misafir sipariş
                </p>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Adresler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.billing_address && (
                <AddressBlock
                  title="Fatura Adresi"
                  address={order.billing_address}
                />
              )}
              {order.shipping_address && (
                <>
                  {order.billing_address && <Separator />}
                  <AddressBlock
                    title="Teslimat Adresi"
                    address={order.shipping_address}
                  />
                </>
              )}
              {!order.billing_address && !order.shipping_address && (
                <p className="text-sm text-muted-foreground">
                  Adres bilgisi bulunamadı.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          {order.payments && order.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ödemeler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {payment.method}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString(
                            "tr-TR",
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(payment.amount)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {PAYMENT_STATUS_LABELS[payment.status] ??
                            payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: OrderAddress;
}) {
  return (
    <div>
      <h4 className="mb-1 text-sm font-medium text-muted-foreground">
        {title}
      </h4>
      <p className="text-sm font-medium">{address.full_name}</p>
      <p className="text-sm">{address.phone}</p>
      <p className="text-sm">{address.address_line}</p>
      <p className="text-sm">
        {address.district}, {address.city}
        {address.zip_code ? ` ${address.zip_code}` : ""}
      </p>
    </div>
  );
}

function MixerSnapshotDisplay({
  snapshot,
}: {
  snapshot: Record<string, unknown>;
}) {
  return (
    <div className="mt-1 rounded bg-muted p-2 text-xs">
      {Object.entries(snapshot).map(([key, value]) => (
        <div key={key}>
          <span className="font-medium">{key}:</span>{" "}
          {typeof value === "object" ? JSON.stringify(value) : String(value)}
        </div>
      ))}
    </div>
  );
}
