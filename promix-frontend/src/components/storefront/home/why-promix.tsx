import Link from "next/link";

const REASONS = [
  {
    number: "01",
    title: "Sen Seç, Biz Gönderelim",
    text: "Protein bazından aromaya, ekstra bileşenlerden bidona kadar her şeyi kendin belirle. Hazır paketlerdeki gereksiz katkılar yerine sadece ihtiyacın olan bileşenleri al. Tamamen kişiselleştirilmiş bir deneyim.",
  },
  {
    number: "02",
    title: "Ayrı Paketler, Tam Kontrol",
    text: "Her bileşen ayrı ayrı paketlenir ve etiketlenir. Hangi bileşeni ne zaman, ne kadar kullanacağına sen karar ver. Antrenman öncesi farklı, sonrası farklı — esneklik sende.",
  },
  {
    number: "03",
    title: "Kaliteli Bileşenler",
    text: "Tüm bileşenlerimiz sertifikalı üreticilerden temin edilir. Her ürün kalite kontrolünden geçer, şeffaf içerik bilgisiyle sana ulaşır. İçinde ne olduğunu her zaman bilirsin.",
  },
  {
    number: "04",
    title: "Hızlı ve Güvenli Teslimat",
    text: "Siparişin aynı gün hazırlanır ve kargoya verilir. 500₺ üzeri siparişlerde kargo ücretsizdir. 1-3 iş günü içinde paketin kapında. Açılmamış ürünlerde 14 gün iade garantisi.",
  },
];

export function WhyPromix() {
  return (
    <section className="py-20 md:py-28 bg-[#f5f5f3]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#ff6b2c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b2c]">
                AVANTAJLAR
              </span>
            </div>
            <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Neden <span className="text-[#ff6b2c]">Special Whey?</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-lg leading-relaxed text-[#888888]">
              Binlerce kişi bileşenlerini kendisi seçiyor. Kontrol sende olsun,
              kalite bizden gelsin. İşte tercih edilmemizin sebepleri.
            </p>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#e0e0e0] bg-[#e0e0e0] md:grid-cols-2">
          {REASONS.map((reason) => (
            <div key={reason.number} className="bg-white p-8 md:p-10">
              <span className="font-display text-4xl font-black text-[#ff6b2c]/15">
                {reason.number}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#1a1a1a]">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#888888]">
                {reason.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/proteinini-olustur"
            className="inline-flex h-13 items-center justify-center rounded-full bg-[#ff6b2c] px-9 text-sm font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.3)]"
          >
            Paketini Oluşturmaya Başla &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
