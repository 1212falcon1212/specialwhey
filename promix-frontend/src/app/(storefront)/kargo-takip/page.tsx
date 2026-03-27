import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kargo Takip" };

export default function Page() {
  return <StaticPageContent slug="kargo-takip" />;
}
