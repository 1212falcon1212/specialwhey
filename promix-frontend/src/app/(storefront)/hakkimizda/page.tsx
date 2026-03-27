import { StaticPageContent } from "@/components/storefront/pages/static-page-content";

export const metadata = {
  title: "Hakkımızda | Special Whey",
  description: "Special Whey hakkında bilgi edinin.",
};

export default function HakkimizdaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StaticPageContent slug="hakkimizda" />
    </div>
  );
}
