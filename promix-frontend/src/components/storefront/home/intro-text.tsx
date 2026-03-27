import Link from "next/link";

const STATS = [
  { value: "50+", label: "Bileşen Çeşidi" },
  { value: "1-3", label: "Gün Teslimat" },
  { value: "14", label: "Gün İade Hakkı" },
];

export function IntroText() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Top: Title left, Description right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#ff6b2c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b2c]">
                HAKKIMIZDA
              </span>
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Hazır protein tozlarına değil,
              <br />
              <span className="text-[#ff6b2c]">kendi seçimine</span> güven.
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-[#555555]">
              Herkesin vücudu farklı, hedefleri farklı. O yüzden herkes için aynı
              formülü sunmak yerine, bileşenleri senin seçmeni sağlıyoruz. Whey
              protein mi, izolat mı? Çikolata mı, vanilya mı? BCAA eklemek ister
              misin? Karar tamamen senin.
            </p>
            <p className="mt-4 leading-relaxed text-[#888888]">
              Seçtiğin bileşenler ayrı ayrı paketlenir, shaker bidonunla birlikte
              kapına kadar gelir. Karışımı ne zaman, ne oranda yapacağına sen karar
              verirsin — tam kontrol sende.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-[#eeeeee]" />

        {/* Bottom: Stats + CTA */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-10 md:gap-16">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-4xl font-black text-[#1a1a1a] md:text-5xl">
                  {stat.value}
                </span>
                <p className="mt-1 text-sm text-[#888888]">{stat.label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/proteinini-olustur"
            className="inline-flex h-13 items-center justify-center rounded-full bg-[#ff6b2c] px-9 text-sm font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.3)]"
          >
            Hemen Paketini Oluştur &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
