import { RefundDetailPage } from "@/components/admin/refunds/refund-detail-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "İade Detayı | Special Whey Admin" };

export default function IadeDetayPage() {
  return <RefundDetailPage />;
}
