"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AccountSidebar } from "@/components/storefront/account/account-sidebar";

export default function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/giris");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Mobile: Tabs at top */}
      <div className="mb-6 md:hidden">
        <AccountSidebar />
      </div>

      {/* Desktop: Grid layout */}
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <aside className="hidden md:block">
          <AccountSidebar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
