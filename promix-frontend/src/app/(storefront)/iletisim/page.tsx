"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-settings";

export default function IletisimPage() {
  const { settings } = useSettings();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1a1a1a] py-16 md:py-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#ff6b2c]/8 blur-[100px]" />
        <div className="container relative mx-auto px-4">
          <nav className="mb-6 text-sm text-white/40">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="transition-colors hover:text-white/70">Anasayfa</Link></li>
              <li className="text-white/20">/</li>
              <li className="text-white/70">İletişim</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            İletişim
          </h1>
          <p className="mt-3 max-w-lg text-white/50">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bize ulaşın.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-bold text-[#1a1a1a]">İletişim Bilgileri</h2>
              <div className="mt-6 space-y-5">
                {settings?.site_email && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#888888]">E-posta</p>
                    <a href={`mailto:${settings.site_email}`} className="mt-1 block text-[#1a1a1a] font-medium hover:text-[#ff6b2c] transition-colors">
                      {settings.site_email as string}
                    </a>
                  </div>
                )}
                {settings?.site_phone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#888888]">Telefon</p>
                    <a href={`tel:${settings.site_phone}`} className="mt-1 block text-[#1a1a1a] font-medium hover:text-[#ff6b2c] transition-colors">
                      {settings.site_phone as string}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#888888]">Çalışma Saatleri</p>
                  <p className="mt-1 text-[#1a1a1a] font-medium">Pazartesi – Cuma, 09:00 – 18:00</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-[#eeeeee] bg-white p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-[#1a1a1a]">Bize Yazın</h2>
                <p className="mt-1 text-sm text-[#888888]">En kısa sürede size dönüş yapacağız.</p>

                {submitted ? (
                  <div className="mt-8 flex flex-col items-center py-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#1a1a1a]">Mesajınız Gönderildi</h3>
                    <p className="mt-1 text-sm text-[#888888]">Teşekkür ederiz, en kısa sürede dönüş yapacağız.</p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }); }}
                    >
                      Yeni Mesaj Gönder
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Adınız</Label>
                        <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mesajınız</Label>
                      <Textarea id="message" name="message" value={formState.message} onChange={handleChange} required className="min-h-[140px]" />
                    </div>
                    <Button type="submit" className="bg-[#ff6b2c] text-white hover:bg-[#e55a1f]">
                      Gönder
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
