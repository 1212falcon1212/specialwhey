import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade ve Değişim",
  description: "Special Whey iade ve değişim koşulları. 14 gün içinde koşulsuz iade.",
};

export default function Page() {
  return <StaticPageContent slug="iade-ve-degisim" />;
}
