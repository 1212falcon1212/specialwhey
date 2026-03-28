"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { AnimatedJar } from "@/components/shared/animated-jar";

export function MixerSummary() {
  const { currentStep, selectedProtein, selectedFlavor, selectedExtras, selectedBidon, totalPrice } =
    useMixerStore();

  const hasItems =
    selectedProtein || selectedFlavor || selectedExtras.length > 0 || selectedBidon;

  // Step-based fill: 0→0%, seçim yapılınca adım tamamlanır
  const stepFills = [
    selectedProtein ? 25 : 0,
    selectedFlavor ? 25 : 0,
    selectedExtras.length > 0 ? 25 : 0,
    selectedBidon ? 25 : 0,
  ];
  const fillPercent = Math.min(100, stepFills.reduce((a, b) => a + b, 0));

  return (
    <div className="sticky top-24 rounded-xl border border-[#eeeeee] bg-white p-5">
      {/* Animated Jar */}
      <div className="flex justify-center mb-4">
        <AnimatedJar fillPercent={fillPercent} width={100} height={130} />
      </div>

      <h3 className="text-sm font-bold uppercase tracking-wide text-[#888888] text-center">
        PAKETİN
      </h3>

      {!hasItems ? (
        <p className="mt-4 text-center text-sm text-[#888888]">
          Henüz bileşen seçmediniz.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {selectedProtein && (
            <SummaryItem
              label="Protein Bazı"
              name={selectedProtein.name}
              price={selectedProtein.price}
            />
          )}

          {selectedFlavor && (
            <SummaryItem
              label="Aroma"
              name={selectedFlavor.name}
              price={selectedFlavor.price}
            />
          )}

          {selectedExtras.map((extra) => (
            <SummaryItem
              key={extra.ingredientId}
              label="Ekstra"
              name={extra.name}
              price={extra.price}
            />
          ))}

          {selectedBidon && (
            <SummaryItem
              label="Bidon"
              name={selectedBidon.name}
              price={selectedBidon.price}
            />
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#1a1a1a]">Toplam</span>
            <span className="text-lg font-bold text-[#ff6b2c]">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  name,
  price,
}: {
  label: string;
  name: string;
  price: number;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-medium uppercase text-[#888888]">
          {label}
        </p>
        <p className="text-sm text-[#555555]">{name}</p>
      </div>
      <span className="text-sm font-medium text-[#1a1a1a]">
        {formatPrice(price)}
      </span>
    </div>
  );
}
