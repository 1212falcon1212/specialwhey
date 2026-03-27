"use client";

import { useSettings } from "@/hooks/use-settings";

export function MarqueeTicker() {
  const { settings } = useSettings();
  const raw = settings?.["storefront.ticker_messages"];
  const messages: string[] = Array.isArray(raw)
    ? raw
    : [
        "KALİTE GARANTİSİ",
        "AYNI GÜN KARGO",
        "%100 ŞEFFAF İÇERİK",
        "KOŞULSUZ İADE",
        "DOĞAL BİLEŞENLER",
      ];

  const items = [...messages, ...messages];

  return (
    <section className="overflow-hidden bg-[#ff6b2c] py-3.5">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((msg, i) => (
          <span key={i} className="mx-10 shrink-0 text-sm font-bold uppercase tracking-widest text-white">
            {msg}
            <span className="ml-10 text-white/40">•</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
