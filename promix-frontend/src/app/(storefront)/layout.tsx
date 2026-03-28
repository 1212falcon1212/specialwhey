import { Suspense } from "react";
import { StorefrontHeader } from "@/components/storefront/layout/storefront-header";
import { StorefrontFooter } from "@/components/storefront/layout/storefront-footer";
import { CartDrawer } from "@/components/storefront/cart/cart-drawer";
import { RouteProgress } from "@/components/shared/route-progress";
import { PageTransition } from "@/components/shared/page-transition";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
      <StorefrontHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
