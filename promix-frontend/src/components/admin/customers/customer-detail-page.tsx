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
import { formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/constants";
import type { Address } from "@/types/user";
import type { Order } from "@/types/order";
import { ArrowLeft } from "lucide-react";

interface AdminCustomerDetail {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  created_at: string;
  total_spent: number;
  addresses: Address[];
  recent_orders: Order[];
}

export function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useApi<AdminCustomerDetail>(
    `/admin/customers/${params.id}`,
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="col-span-full h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Müşteri bulunamadı.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/musteriler")}
        >
          Geri Dön
        </Button>
      </div>
    );
  }

  const customer = data.data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/musteriler")}
        >
          <ArrowLeft className="mr-1 size-4" />
          Geri
        </Button>
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
          {customer.role === "admin" ? "Admin" : "Müşteri"}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Ad Soyad</dt>
                <dd className="font-medium">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">E-posta</dt>
                <dd className="text-sm">{customer.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Telefon</dt>
                <dd className="text-sm">{customer.phone ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Kayıt Tarihi</dt>
                <dd className="text-sm">
                  {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                </dd>
              </div>
              <Separator />
              <div>
                <dt className="text-sm text-muted-foreground">
                  Toplam Harcama
                </dt>
                <dd className="text-lg font-bold text-emerald-600">
                  {formatPrice(customer.total_spent)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>Adresler</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Kayıtlı adres bulunamadı.
              </p>
            ) : (
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-lg border p-3"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {address.title}
                      </span>
                      {address.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Varsayılan
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{address.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.address_line}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.district}, {address.city}
                      {address.zip_code ? ` ${address.zip_code}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son Siparişler</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.recent_orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Henüz sipariş bulunamadı.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sipariş No</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">Toplam</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.recent_orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link
                          href={`/admin/siparisler/${order.id}`}
                          className="font-medium text-emerald-600 hover:underline"
                        >
                          #{order.order_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ORDER_STATUS_COLORS[order.status] ?? ""
                          }
                        >
                          {ORDER_STATUS_LABELS[order.status] ?? order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(
                          "tr-TR",
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
