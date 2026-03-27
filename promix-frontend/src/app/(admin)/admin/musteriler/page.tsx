import { CustomerListPage } from "@/components/admin/customers/customer-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Müşteriler | Special Whey Admin" };

export default function MusterilerPage() {
  return <CustomerListPage />;
}
