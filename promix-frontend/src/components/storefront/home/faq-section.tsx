"use client";

import { useState, useCallback } from "react";

const FAQ_ITEMS = [
  {
    question: "Sipariş nasıl hazırlanıyor?",
    answer:
      "Seçtiğiniz bileşenler tek tek kontrol edilir ve ayrı paketler halinde bidonunuzla birlikte gönderilir. Karışımı kendiniz, istediğiniz oranda hazırlayabilirsiniz.",
  },
  {
    question: "Minimum sipariş miktarı nedir?",
    answer:
      "Minimum sipariş 500g'dır. 500g ve 1000g olmak üzere iki farklı gramaj seçeneğimiz bulunmaktadır.",
  },
  {
    question: "Kargo ne kadar sürer?",
    answer:
      "Siparişiniz aynı gün hazırlanır ve kargoya verilir. 1-3 iş günü içinde kapınızda olur. 500\u20BA üzeri siparişlerde kargo ücretsizdir.",
  },
  {
    question: "İade yapabilir miyim?",
    answer:
      "Açılmamış ürünlerde 14 gün içinde koşulsuz iade garantisi sunuyoruz. Açılmış ürünlerde kalite sorunu varsa değişim yapılır.",
  },
  {
    question: "Bileşenlerin kalite sertifikaları var mı?",
    answer:
      "Tüm bileşenlerimiz güvenilir ve sertifikalı üreticilerden temin edilmektedir. Her ürün kalite kontrolünden geçirilir.",
  },
] as const;

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#eeeeee]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[#ff6b2c]"
      >
        <span className="text-base font-medium text-[#1a1a1a] pr-4">
          {question}
        </span>
        <span
          className={`flex-shrink-0 text-2xl leading-none text-[#888888] transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-[#888888]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section id="sss" className="py-16 md:py-24 bg-[#fafaf8]">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12 text-[#1a1a1a]">
          Sıkça Sorulan{" "}
          <span className="font-bold text-[#ff6b2c]">Sorular</span>
        </h2>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
