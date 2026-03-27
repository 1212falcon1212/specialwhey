import { OrderListPage } from "@/components/admin/orders/order-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Siparişler | Special Whey Admin" };

export default function SiparislerPage() {
  return <OrderListPage />;
}
