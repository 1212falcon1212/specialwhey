import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2218] py-24 md:py-36">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
      {/* Accent glow */}
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#ff6b2c]/10 blur-[120px]" />

      <div className="container relative mx-auto px-4 text-center">
        <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
          Bileşenleri{" "}
          <span className="bg-gradient-to-r from-[#ff6b2c] to-[#ff9a5c] bg-clip-text text-transparent">
            Sen Seç
          </span>
          <br />
          Paketini Biz Gönderelim
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
          Protein bazını, aromayı ve ekstra bileşenleri kendin belirle.
          Seçtiğin bileşenler özel paketlerle kapına gelsin.
        </p>

        <Link
          href="/proteinini-olustur"
          className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-[#ff6b2c] px-10 text-base font-bold text-white transition-all hover:bg-[#e55a1f] hover:shadow-[0_8px_30px_rgba(255,107,44,0.35)]"
        >
          Karışımını Oluştur &rarr;
        </Link>
      </div>
    </section>
  );
}
