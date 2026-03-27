"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaginatedApi } from "@/hooks/use-api";
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
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
  REFUND_REASON_LABELS,
} from "@/lib/constants";
import type { RefundRequest } from "@/types/order";

interface AdminRefund extends RefundRequest {
  user?: { id: number; name: string; email: string };
}

export function RefundListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const queryParams = new URLSearchParams({ page: String(page), per_page: "15" });
  if (status) queryParams.set("status", status);

  const { data, isLoading } = usePaginatedApi<AdminRefund>(
    `/admin/refunds?${queryParams}`,
  );

  const refunds = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">İade Talepleri</h1>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <Select
          value={status}
          onValueChange={(val) => {
            if (val !== null) {
              setStatus(val === "__all__" ? "" : val);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Durum Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tümü</SelectItem>
            {Object.entries(REFUND_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {status && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus("");
              setPage(1);
            }}
          >
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
      ) : refunds.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          İade talebi bulunamadı.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Sebep</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund) => (
                <TableRow
                  key={refund.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/iadeler/${refund.id}`)}
                >
                  <TableCell className="font-medium">
                    #{refund.order?.order_number ?? "-"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">
                        {refund.user?.name ?? "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {refund.user?.email ?? "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {refund.reason_label ??
                      REFUND_REASON_LABELS[refund.reason] ??
                      refund.reason}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(refund.refund_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={REFUND_STATUS_COLORS[refund.status] ?? ""}
                    >
                      {refund.status_label ??
                        REFUND_STATUS_LABELS[refund.status] ??
                        refund.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(refund.created_at).toLocaleDateString("tr-TR")}
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
            Toplam {meta.total} iade talebi
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
