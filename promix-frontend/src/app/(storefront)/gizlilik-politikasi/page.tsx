import { StaticPageContent } from "@/components/storefront/pages/static-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Special Whey gizlilik politikası. Kişisel verilerinizin korunması hakkında.",
};

export default function Page() {
  return <StaticPageContent slug="gizlilik-politikasi" />;
}
