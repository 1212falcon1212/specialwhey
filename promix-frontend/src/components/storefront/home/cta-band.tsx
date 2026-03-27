import Link from "next/link";

export function CtaBand() {
  return (
    <section className="py-16 md:py-20 bg-[#ff6b2c]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-black tracking-tight text-white md:text-4xl">
          Kendi protein paketini oluşturmaya hazır mısın?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
          Bileşenlerini seç, bidonunu belirle. Paketin aynı gün kargoya verilsin.
        </p>
        <Link
          href="/proteinini-olustur"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-[#ff6b2c] transition-all hover:bg-[#f0f0ee] hover:shadow-lg"
        >
          Hemen Başla
        </Link>
      </div>
    </section>
  );
}
