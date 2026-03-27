"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export function CouponListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: "15",
  });
  if (search) queryParams.set("search", search);

  const { data, isLoading, mutate } = usePaginatedApi<Coupon>(
    `/admin/coupons?${queryParams}`,
  );

  const coupons = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kuponu silmek istediginize emin misiniz?")) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success("Kupon silindi.");
      mutate();
    } catch {
      toast.error("Silme islemi basarisiz.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kuponlar</h1>
        <Link
          href="/admin/kuponlar/yeni"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Yeni Kupon
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Kupon kodu ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Kupon bulunamadi.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod</TableHead>
                <TableHead>Tur</TableHead>
                <TableHead>Deger</TableHead>
                <TableHead>Min. Siparis</TableHead>
                <TableHead>Kullanim</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Bitis</TableHead>
                <TableHead>Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.type === "percentage" ? "Yuzde" : "Sabit"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.type === "percentage"
                      ? `%${coupon.value}`
                      : formatPrice(coupon.value)}
                  </TableCell>
                  <TableCell>
                    {coupon.min_order_amount
                      ? formatPrice(coupon.min_order_amount)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count}
                    {coupon.usage_limit
                      ? ` / ${coupon.usage_limit}`
                      : " / Sinirsiz"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.is_active ? "default" : "secondary"}
                    >
                      {coupon.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleDateString("tr-TR")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/kuponlar/${coupon.id}`}
                        className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted"
                      >
                        Duzenle
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground">
            Toplam {meta.total} kupon
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
            >
              Onceki
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
