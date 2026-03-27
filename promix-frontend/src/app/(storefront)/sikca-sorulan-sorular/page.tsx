import { StaticPageContent } from "@/components/storefront/pages/static-page-content";

export const metadata = {
  title: "Sıkça Sorulan Sorular | Special Whey",
  description: "Special Whey hakkında sıkça sorulan sorular ve cevapları.",
};

export default function SikcaSorulanSorularPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StaticPageContent slug="sikca-sorulan-sorular" />
    </div>
  );
}
