import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Special Whey hakkında sıkça sorulan sorular ve cevapları.",
};

export default function Page() {
  return <StaticPageContent slug="sikca-sorulan-sorular" />;
}
