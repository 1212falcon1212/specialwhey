import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kargo Takip",
  description: "Special Whey sipariş kargo takip. Siparişinizin durumunu öğrenin.",
};

export default function Page() {
  return <StaticPageContent slug="kargo-takip" />;
}
