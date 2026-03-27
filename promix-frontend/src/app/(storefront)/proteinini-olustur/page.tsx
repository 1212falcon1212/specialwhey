import { MixerPage } from "@/components/storefront/mixer/mixer-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proteinini Oluştur",
  description: "Kendi protein karışımını adım adım oluştur. Bileşenleri seç, karıştır, sipariş ver.",
  openGraph: {
    title: "Proteinini Oluştur | Special Whey",
    description: "Kendi protein karışımını adım adım oluştur.",
  },
  alternates: { canonical: "/proteinini-olustur" },
};

export default function ProteininiOlusturPage() {
  return <MixerPage />;
}
