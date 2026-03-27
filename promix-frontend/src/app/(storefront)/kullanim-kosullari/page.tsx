import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kullanım Koşulları" };

export default function Page() {
  return <StaticPageContent slug="kullanim-kosullari" />;
}
