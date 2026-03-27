import { SettingsPage } from "@/components/admin/settings/settings-page";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ayarlar | Special Whey Admin" };

export default function AyarlarPage() {
  return <SettingsPage />;
}
