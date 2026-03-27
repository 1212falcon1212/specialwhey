import { RefundListPage } from "@/components/admin/refunds/refund-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "İade Talepleri | Special Whey Admin" };

export default function IadelerPage() {
  return <RefundListPage />;
}
