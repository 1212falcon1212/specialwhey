"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi<Coupon>(`/admin/coupons/${id}`);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kupon Düzenle</h1>
      <CouponForm couponId={id} initialData={data?.data} />
    </div>
  );
}
