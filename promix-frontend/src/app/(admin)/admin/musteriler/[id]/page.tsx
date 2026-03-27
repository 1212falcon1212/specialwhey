import { CustomerDetailPage } from "@/components/admin/customers/customer-detail-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Müşteri Detayı | Special Whey Admin" };

export default function MusteriDetayPage() {
  return <CustomerDetailPage />;
}
