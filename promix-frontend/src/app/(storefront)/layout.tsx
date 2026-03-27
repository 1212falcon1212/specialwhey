import { StorefrontHeader } from "@/components/storefront/layout/storefront-header";
import { StorefrontFooter } from "@/components/storefront/layout/storefront-footer";
import { CartDrawer } from "@/components/storefront/cart/cart-drawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
