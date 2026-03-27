"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  MapPin,
  Package,
  Heart,
  CreditCard,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { logout as logoutApi } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const accountNavItems = [
  { href: "/hesabim/profil", label: "Profilim", icon: User },
  { href: "/hesabim/siparislerim", label: "Siparişlerim", icon: Package },
  { href: "/hesabim/adreslerim", label: "Adreslerim", icon: MapPin },
  { href: "/hesabim/favorilerim", label: "Favorilerim", icon: Heart },
  { href: "/hesabim/kartlarim", label: "Kayıtlı Kartlarım", icon: CreditCard },
  { href: "/hesabim/iadelerim", label: "İadelerim", icon: RotateCcw },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const storeLogout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Token may already be invalid, proceed with local logout
    }
    storeLogout();
    toast.success("Çıkış yapıldı.");
    router.push("/giris");
  };

  return (
    <>
      {/* Mobile: Horizontal scroll tabs */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {accountNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[rgba(255,107,44,0.2)] bg-[rgba(255,107,44,0.08)] text-[#ff6b2c]"
                    : "border-[#eeeeee] bg-[#fafaf8] text-[#666666] hover:bg-[#f0f0ee]"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#eeeeee] bg-[#fafaf8] px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Çıkış
          </button>
        </div>
      </div>

      {/* Desktop: Vertical sidebar */}
      <Card className="hidden md:block">
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {accountNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[rgba(255,107,44,0.08)] text-[#ff6b2c]"
                      : "text-[#666666] hover:bg-[#f0f0ee] hover:text-[#1a1a1a]"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Çıkış Yap
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
