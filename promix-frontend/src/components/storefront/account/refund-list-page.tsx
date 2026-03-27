"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { formatPrice } from "@/lib/utils";
import type { RefundRequest } from "@/types/order";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefundStatusBadge } from "./refund-status-badge";
import { RotateCcw } from "lucide-react";

export function RefundListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePaginatedApi<RefundRequest>(
    `/account/refunds?page=${page}`
  );

  const refunds = data?.data ?? [];
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
          İade talepleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">İadelerim</h1>

      {refunds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <RotateCcw className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            İade talebiniz bulunmuyor.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {refunds.map((refund) => (
              <Card key={refund.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {refund.order ? (
                          <Link
                            href={`/hesabim/siparislerim/${refund.order.order_number}`}
                            className="font-semibold text-[#ff6b2c] hover:underline"
                          >
                            #{refund.order.order_number}
                          </Link>
                        ) : (
                          <span className="font-semibold">
                            Sipariş #{refund.order_id}
                          </span>
                        )}
                        <RefundStatusBadge status={refund.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>
                          {new Date(refund.created_at).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>
                        <span>{refund.reason_label}</span>
                      </div>
                      {refund.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {refund.description}
                        </p>
                      )}
                      {refund.admin_notes && (
                        <p className="mt-2 rounded-md bg-muted p-2 text-sm">
                          <span className="font-medium">Admin notu: </span>
                          {refund.admin_notes}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-semibold text-[#ff6b2c]">
                      {formatPrice(refund.refund_amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
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
