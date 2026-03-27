import Link from "next/link";

export function IntroText() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
            Hazır protein tozlarına değil,
            <br />
            <span className="text-[#ff6b2c]">kendi seçimine</span> güven.
          </h2>
          <div className="mt-6 space-y-4 text-[#555555] leading-relaxed">
            <p>
              Herkesin vücudu farklı, hedefleri farklı. O yüzden herkes için aynı
              formülü sunmak yerine, bileşenleri senin seçmeni sağlıyoruz. Whey
              protein mi, izolat mı? Çikolata mı, vanilya mı? BCAA eklemek ister
              misin? Karar senin.
            </p>
            <p>
              Seçtiğin bileşenler ayrı ayrı paketlenir, shaker bidonunla birlikte
              kapına kadar gelir. Karışımı ne zaman, ne oranda yapacağına sen karar
              verirsin.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/proteinini-olustur"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff6b2c] px-8 text-sm font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_6px_24px_rgba(255,107,44,0.3)]"
            >
              Hemen Paketini Oluştur
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
