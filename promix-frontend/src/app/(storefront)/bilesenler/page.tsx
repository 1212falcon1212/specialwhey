import { Metadata } from "next";
import { IngredientsListPage } from "@/components/storefront/ingredients/ingredients-list-page";

export const metadata: Metadata = {
  title: "Bilesenler | Special Whey",
  description:
    "Special Whey protein bilesenleri: whey protein, izolat, BCAA, kreatin ve daha fazlasi hakkinda detayli bilgi.",
};

export default function Page() {
  return <IngredientsListPage />;
}
