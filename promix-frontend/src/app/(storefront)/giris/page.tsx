import { LoginPage } from "@/components/storefront/auth/login-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Special Whey hesabınıza giriş yapın.",
  alternates: { canonical: "/giris" },
};

export default function GirisPage() {
  return <LoginPage />;
}
