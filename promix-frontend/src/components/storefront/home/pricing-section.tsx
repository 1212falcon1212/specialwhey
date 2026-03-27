import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const PLANS = [
  {
    name: "Başlangıç",
    size: "500g Blend",
    price: 299,
    featured: false,
    badge: null,
    features: [
      "500g bileşen paketi",
      "2 protein bazı seçimi",
      "1 aroma seçimi",
      "2 ekstra bileşen",
      "Kalite garantisi",
    ],
  },
  {
    name: "En Popüler",
    size: "1000g Blend",
    price: 499,
    featured: true,
    badge: "En Popüler",
    features: [
      "1000g bileşen paketi",
      "3 protein bazı seçimi",
      "2 aroma seçimi",
      "5 ekstra bileşen",
      "Kalite garantisi",
      "Ücretsiz kargo",
    ],
  },
  {
    name: "Abonelik",
    size: "Aylık",
    price: 399,
    featured: false,
    badge: "%20 İndirimli",
    features: [
      "1000g aylık teslimat",
      "Sınırsız bileşen seçimi",
      "Her ay bileşen değiştir",
      "Ücretsiz kargo",
      "Öncelikli üretim",
      "Kişisel beslenme danışmanı",
    ],
  },
] as const;

export function PricingSection() {
  return (
    <section className="py-16 md:py-24 bg-[#fafaf8]">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
          Fiyatlandırma
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                plan.featured
                  ? "border-[#ff6b2c] shadow-md"
                  : "border-[#eeeeee]"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold ${
                    plan.featured
                      ? "bg-[#ff6b2c] text-white"
                      : "bg-[#fff3ed] text-[#ff6b2c]"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-[#888888] mb-4">{plan.size}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#1a1a1a]">
                  {formatPrice(plan.price)}
                </span>
                {plan.name === "Abonelik" && (
                  <span className="text-sm text-[#888888]">/ay</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-[#555555]"
                  >
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ff6b2c]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/proteinini-olustur"
                className={`block w-full text-center rounded-full py-3 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#ff6b2c] text-white hover:bg-[#e55a1f]"
                    : "border border-[#1a1a1a]/20 text-[#1a1a1a] hover:bg-[#1a1a1a]/5"
                }`}
              >
                Karışımını Oluştur
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
