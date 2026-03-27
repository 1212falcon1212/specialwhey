"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, ShoppingBag, Heart, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "/bilesenler", label: "Bileşenler" },
  { href: "/blog", label: "Blog" },
  { href: "/sikca-sorulan-sorular", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export function MobileMenu() {
  const [mounted, setMounted] = useState(false);

  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { settings } = useSettings();
  const siteLogo = settings?.site_logo as string | undefined;

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    requestAnimationFrame(() => setMounted(true));
  }, []);

  function handleClose() {
    setMobileMenuOpen(false);
  }

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>
            {siteLogo ? (
              <Image src={siteLogo} alt="Special Whey" width={160} height={48} className="h-10 w-auto" unoptimized />
            ) : (
              <span className="text-xl font-bold tracking-tight">
                Special <span className="text-[#ff6b2c]">Whey</span>
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col overflow-y-auto px-4 py-4">
          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleClose}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/proteinini-olustur"
            onClick={handleClose}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#ff6b2c] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e55a1f]"
          >
            <Sparkles className="size-4" />
            Karışımını Oluştur
          </Link>

          <Separator className="my-4" />

          {/* Auth Section */}
          {mounted && isAuthenticated ? (
            <>
              {user && (
                <div className="mb-2 px-3 text-sm font-medium text-muted-foreground">
                  {user.name}
                </div>
              )}
              <Link
                href="/hesabim"
                onClick={handleClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <User className="size-4" />
                Hesabım
              </Link>
              <Link
                href="/hesabim/favorilerim"
                onClick={handleClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Heart className="size-4" />
                Favorilerim
              </Link>
              <Link
                href="/hesabim/siparislerim"
                onClick={handleClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <ShoppingBag className="size-4" />
                Siparişlerim
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleClose();
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                onClick={handleClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <User className="size-4" />
                Giriş
              </Link>
              <Link
                href="/kayit"
                onClick={handleClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#ff6b2c] hover:bg-[rgba(255,107,44,0.08)]"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
