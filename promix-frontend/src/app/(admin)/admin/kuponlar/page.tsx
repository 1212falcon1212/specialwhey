import { CouponListPage } from "@/components/admin/coupons/coupon-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kuponlar | Special Whey Admin" };

export default function KuponlarPage() {
  return <CouponListPage />;
}
