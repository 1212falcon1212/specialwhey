import { BannerListPage } from "@/components/admin/banners/banner-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bannerlar | Special Whey Admin" };

export default function BannerlarPage() {
  return <BannerListPage />;
}
