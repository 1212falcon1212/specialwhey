import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Special Whey hakkında bilgi edinin. Kişiye özel protein paketleri.",
};

export default function Page() {
  return <StaticPageContent slug="hakkimizda" />;
}
