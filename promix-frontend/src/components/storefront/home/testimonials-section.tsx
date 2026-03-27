const TESTIMONIALS = [
  {
    name: "Ahmet Yılmaz",
    role: "Fitness Antrenörü",
    quote:
      "Kendi protein karışımımı oluşturabilmek harika. Artık ihtiyacım olmayan bileşenler için para ödemiyorum.",
  },
  {
    name: "Elif Kaya",
    role: "Yoga Eğitmeni",
    quote:
      "Bitkisel protein bazı seçeneği sayesinde vegan diyetime uygun karışımımı kolayca hazırlatabiliyorum.",
  },
  {
    name: "Mert Demir",
    role: "Vücut Geliştirme Sporcusu",
    quote:
      "Bileşenlerin ayrı ayrı paketlenip gelmesi harika. Kaliteden ödün vermiyorlar.",
  },
] as const;

function StarRating() {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[#ff6b2c] text-lg">
          &#x2605;
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#fafaf8]">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
          Müşterilerimiz{" "}
          <span className="font-bold text-[#ff6b2c]">Ne Diyor?</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl border border-[#eeeeee] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <StarRating />

              <p className="text-[#555555] text-sm leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#f5f5f3] flex items-center justify-center text-sm font-semibold text-[#888888]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#888888]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
