"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";

export function StorefrontFooter() {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");

  const footerAbout = (settings?.['storefront.footer_about_text'] as string) ??
    'Special Whey, kişiselleştirilmiş protein karışımları sunan yenilikçi bir platformdur. Bilimsel formüllerle desteklenen ürünlerimizle sağlıklı yaşam hedeflerinize ulaşmanıza yardımcı oluyoruz.';

  return (
    <footer className="bg-[#1a1a1a] text-white/40">
      {/* Main: Logo + Links + Newsletter in one row */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Logo + About (spans 2 cols on lg) */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              {settings?.site_favicon ? (
                <Image src={settings.site_favicon as string} alt="Special Whey" width={48} height={48} className="size-12" unoptimized />
              ) : null}
              <span className="text-xl font-bold tracking-tight text-white">
                Special <span className="text-[#ff6b2c]">Whey</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              {footerAbout}
            </p>
            {/* Social */}
            <div className="mt-4 flex items-center gap-3">
              {settings?.instagram_url && (
                <a href={settings.instagram_url as string} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#2a2a2a] p-2 transition-colors hover:bg-[#ff6b2c]">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url as string} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#2a2a2a] p-2 transition-colors hover:bg-[#ff6b2c]">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url as string} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#2a2a2a] p-2 transition-colors hover:bg-[#ff6b2c]">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/iletisim" className="transition-colors hover:text-[#ff6b2c]">İletişim</Link></li>
              <li><Link href="/sikca-sorulan-sorular" className="transition-colors hover:text-[#ff6b2c]">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/kargo-takip" className="transition-colors hover:text-[#ff6b2c]">Kargo Takip</Link></li>
              <li><Link href="/iade-ve-degisim" className="transition-colors hover:text-[#ff6b2c]">İade ve Değişim</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Hakkımızda
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/hakkimizda" className="transition-colors hover:text-[#ff6b2c]">Biz Kimiz</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-[#ff6b2c]">Blog</Link></li>
              <li><Link href="/gizlilik-politikasi" className="transition-colors hover:text-[#ff6b2c]">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari" className="transition-colors hover:text-[#ff6b2c]">Kullanım Koşulları</Link></li>
            </ul>
          </div>

          {/* Newsletter + Contact (spans 2 cols on lg) */}
          <div className="col-span-2">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Bülten
            </h4>
            <p className="mb-3 text-sm leading-relaxed">
              Kampanya ve yeni ürünlerden haberdar olun. Abone olanlara <span className="font-semibold text-[#ff6b2c]">%10 indirim!</span>
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex gap-2"
            >
              <Input
                id="footer-newsletter"
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-[#2a2a2a] text-white placeholder:text-white/30"
                required
              />
              <Button type="submit" size="icon" className="shrink-0 bg-[#ff6b2c] hover:bg-[#e85a1e]">
                <Send className="size-4" />
              </Button>
            </form>

            {/* Contact info */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/40">
              {settings?.site_phone && (
                <a href={`tel:${settings.site_phone}`} className="flex items-center gap-1.5 transition-colors hover:text-[#ff6b2c]">
                  <Phone className="size-3.5 shrink-0" />
                  {settings.site_phone}
                </a>
              )}
              {settings?.site_email && (
                <a href={`mailto:${settings.site_email}`} className="flex items-center gap-1.5 transition-colors hover:text-[#ff6b2c]">
                  <Mail className="size-3.5 shrink-0" />
                  {settings.site_email}
                </a>
              )}
              <Link href="/iletisim" className="flex items-center gap-1.5 transition-colors hover:text-[#ff6b2c]">
                <MessageCircle className="size-3.5 shrink-0" />
                Canlı Destek
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright + Payment */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Special Whey. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Ödeme Yöntemleri:</span>
            <div className="flex items-center gap-2 text-xs font-medium text-white/40">
              <span className="rounded bg-[#2a2a2a] px-2 py-1">VISA</span>
              <span className="rounded bg-[#2a2a2a] px-2 py-1">MC</span>
              <span className="rounded bg-[#2a2a2a] px-2 py-1">TROY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
