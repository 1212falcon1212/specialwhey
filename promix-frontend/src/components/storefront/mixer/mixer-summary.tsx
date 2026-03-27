"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export function MixerSummary() {
  const { selectedProtein, selectedFlavor, selectedExtras, selectedBidon, totalPrice } =
    useMixerStore();

  const hasItems =
    selectedProtein || selectedFlavor || selectedExtras.length > 0 || selectedBidon;

  return (
    <div className="sticky top-24 rounded-xl border border-[#eeeeee] bg-white p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-[#888888]">
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
