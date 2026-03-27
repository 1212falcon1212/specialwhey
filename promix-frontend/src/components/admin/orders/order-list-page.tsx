"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaginatedApi } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

interface AdminOrder extends Order {
  user?: { id: number; name: string; email: string };
}

export function OrderListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const queryParams = new URLSearchParams({ page: String(page), per_page: "15" });
  if (search) queryParams.set("search", search);
  if (status) queryParams.set("status", status);
  if (paymentStatus) queryParams.set("payment_status", paymentStatus);

  const { data, isLoading } = usePaginatedApi<AdminOrder>(
    `/admin/orders?${queryParams}`,
  );

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setPage(1);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Siparişler</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Sipariş no veya müşteri ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(val) => {
            if (val !== null) {
              setStatus(val === "__all__" ? "" : val);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tümü</SelectItem>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={paymentStatus}
          onValueChange={(val) => {
            if (val !== null) {
              setPaymentStatus(val === "__all__" ? "" : val);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ödeme Durumu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tümü</SelectItem>
            {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || status || paymentStatus) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Temizle
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Sipariş bulunamadı.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Ödeme Durumu</TableHead>
                <TableHead>Toplam</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/siparisler/${order.id}`)}
                >
                  <TableCell className="font-medium">
                    #{order.order_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">
                        {order.user?.name ?? "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.user?.email ?? "-"}
                      </div>
                    </div>
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
                  <TableCell>
                    <Badge variant="outline">
                      {PAYMENT_STATUS_LABELS[order.payment_status] ??
                        order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("tr-TR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground">
            Toplam {meta.total} sipariş
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
            >
              Önceki
            </Button>
            <span className="text-sm text-muted-foreground">
              {meta.current_page} / {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page + 1)}
              disabled={meta.current_page >= meta.last_page}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
