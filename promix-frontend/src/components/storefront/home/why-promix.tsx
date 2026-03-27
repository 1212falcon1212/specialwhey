import Link from "next/link";

const REASONS = [
  {
    title: "Sen Seç, Biz Gönderelim",
    text: "Protein bazından aromaya, ekstra bileşenlerden bidona kadar her şeyi kendin belirle. Hazır paketlerdeki gereksiz katkılar yerine sadece ihtiyacın olan bileşenleri al.",
  },
  {
    title: "Ayrı Paketler, Tam Kontrol",
    text: "Her bileşen ayrı ayrı paketlenir. Hangi bileşeni ne zaman, ne kadar kullanacağına sen karar ver. Tek bir karışıma mahkum kalma.",
  },
  {
    title: "Kaliteli Bileşenler",
    text: "Tüm bileşenlerimiz sertifikalı üreticilerden temin edilir. Kalite kontrolünden geçer ve şeffaf içerik bilgisiyle sana ulaşır.",
  },
];

export function WhyPromix() {
  return (
    <section className="py-16 md:py-24 bg-[#f5f5f3]">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-black tracking-tight text-[#1a1a1a] md:text-4xl">
            Neden <span className="text-[#ff6b2c]">Special Whey?</span>
          </h2>
          <p className="mt-3 text-[#888888] max-w-lg">
            Binlerce kişi bileşenlerini kendisi seçiyor. İşte tercih edilmemizin
            sebepleri.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {REASONS.map((reason) => (
              <div key={reason.title}>
                <h3 className="text-lg font-bold text-[#1a1a1a]">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888888]">
                  {reason.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/proteinini-olustur"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff6b2c] px-8 text-sm font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_6px_24px_rgba(255,107,44,0.3)]"
            >
              Paketini Oluşturmaya Başla
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
