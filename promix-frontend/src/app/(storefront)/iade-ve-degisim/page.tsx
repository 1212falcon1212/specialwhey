import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "İade ve Değişim" };

export default function Page() {
  return <StaticPageContent slug="iade-ve-degisim" />;
}
