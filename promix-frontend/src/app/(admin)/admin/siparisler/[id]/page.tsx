import { OrderDetailPage } from "@/components/admin/orders/order-detail-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sipariş Detayı | Special Whey Admin" };

export default function SiparisDetayPage() {
  return <OrderDetailPage />;
}
