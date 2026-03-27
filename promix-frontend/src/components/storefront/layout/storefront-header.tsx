"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, User, LogOut, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { formatPrice } from "@/lib/utils";
import { TopBar } from "./top-bar";
import { MobileMenu } from "./mobile-menu";

export function StorefrontHeader() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const { settings } = useSettings();
  const siteLogo = settings?.site_logo as string | undefined;

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 36);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const itemCount = mounted ? totalItems() : 0;
  const cartTotal = mounted ? totalPrice() : 0;

  return (
    <>
      <TopBar />

      <header className={`sticky top-0 z-50 transition-all ${isScrolled ? "bg-[#fafaf8] shadow-[0_1px_20px_rgba(255,107,44,0.08)]" : "bg-[#fafaf8]"}`}>
        {/* Row 1: Slogan + Logo (centered) + Actions */}
        <div className="container mx-auto flex h-16 items-center px-4 lg:h-20">
          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="size-5" />
            <span className="sr-only">Menü</span>
          </Button>

          {/* Left: Slogan (desktop only) */}
          <span className="hidden text-xs tracking-wide text-[#888888] lg:block">
            Kişiye Özel Protein Paketi
          </span>

          {/* Center: Logo */}
          <div className="flex-1 text-center">
            <Link href="/" className="inline-block">
              {siteLogo ? (
                <Image src={siteLogo} alt="Special Whey" width={300} height={90} className="h-18 w-auto lg:h-[90px]" unoptimized />
              ) : (
                <span className="text-xl font-bold tracking-tight lg:text-3xl">
                  Special <span className="text-[#ff6b2c]">Whey</span>
                </span>
              )}
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Auth - Desktop */}
            <div className="hidden lg:block">
              {mounted && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" />}
                  >
                    <User className="size-5" />
                    <span className="sr-only">Hesabım</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8}>
                    {user && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-medium">
                          {user.name}
                        </div>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem>
                      <Link href="/hesabim" className="flex w-full items-center gap-2">
                        <User className="size-4" />
                        Hesabım
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="size-4" />
                      Çıkış
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" render={<Link href="/giris" />}>
                  <User className="size-4" />
                  Giriş
                </Button>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative flex items-center gap-1.5"
              onClick={toggleDrawer}
            >
              <div className="relative">
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-[#ff6b2c] p-0 text-[10px] text-white">
                    {itemCount}
                  </Badge>
                )}
              </div>
              {mounted && cartTotal > 0 && (
                <span className="hidden text-sm font-medium lg:inline">
                  {formatPrice(cartTotal)}
                </span>
              )}
              <span className="sr-only">Sepet</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Nav - centered (desktop only) */}
        <div className="hidden border-t border-[#eeeeee] lg:block">
          <div className="container mx-auto px-4">
            <nav className="flex h-12 items-center justify-center gap-8">
              <Link
                href="/#nasil-calisir"
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Nasıl Çalışır
              </Link>
              <Link
                href="/bilesenler"
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Bileşenler
              </Link>
              <Link
                href="/proteinini-olustur"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#ff6b2c] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e85a1e]"
              >
                <Sparkles className="size-4" />
                Karışımını Oluştur
              </Link>
              <Link
                href="/blog"
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/iletisim"
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                İletişim
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
