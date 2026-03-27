"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { logout as logoutApi } from "@/lib/auth";
import { toast } from "sonner";

const adminNavItems = [
  { href: "/admin/panel", label: "Dashboard" },
  { href: "/admin/bilesenler", label: "Bileşenler" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/sablonlar", label: "Mixer Şablonları" },
  { href: "/admin/siparisler", label: "Siparişler" },
  { href: "/admin/musteriler", label: "Müşteriler" },
  { href: "/admin/iadeler", label: "İade Talepleri" },
  { href: "/admin/kuponlar", label: "Kuponlar" },
  { href: "/admin/sayfalar", label: "Sayfalar" },
  { href: "/admin/bannerlar", label: "Bannerlar" },
  { href: "/admin/blog", label: "Blog Yazıları" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // token expired etc - still logout locally
    }
    logout();
    toast.success("Çıkış yapıldı.");
    router.push("/admin/giris");
  };

  // Login sayfasında sidebar gösterme
  if (pathname === "/admin/giris") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-gray-50 md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin/panel" className="text-xl font-bold">
            Special <span className="text-emerald-600">Whey</span>
            <span className="ml-1 text-xs text-muted-foreground">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || (item.href !== "/admin/panel" && pathname.startsWith(item.href))
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Siteye Git
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Çıkış
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
