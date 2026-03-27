import { Metadata } from "next";
import { IngredientDetailPage } from "@/components/storefront/ingredients/ingredient-detail-page";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} | Special Whey Bilesenler`,
    description: `${title} hakkinda detayli bilgi. Special Whey bilesen rehberi.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <IngredientDetailPage slug={slug} />;
}
