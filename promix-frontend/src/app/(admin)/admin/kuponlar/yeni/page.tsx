"use client";

import { CouponForm } from "@/components/admin/coupons/coupon-form";

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yeni Kupon</h1>
      <CouponForm />
    </div>
  );
}
