"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Pencil, X } from "lucide-react";

export function MixerStepSummary() {
  const {
    selectedProtein,
    selectedFlavor,
    selectedExtras,
    selectedBidon,
    totalPrice,
    prevStep,
    setStep,
    toCartItem,
    reset,
  } = useMixerStore();
  const { addItem, setDrawerOpen } = useCartStore();

  function handleAddToCart() {
    const cartItem = toCartItem();
    addItem(cartItem);
    setDrawerOpen(true);
    reset();
  }

  const hasItems = selectedProtein || selectedFlavor || selectedExtras.length > 0 || selectedBidon;

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#eeeeee] py-16">
        <p className="text-sm text-[#888888]">
          Henüz bileşen seçmediniz. Geri dönüp bileşen seçin.
        </p>
        <Button onClick={prevStep} variant="outline" className="mt-4">
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-[#1a1a1a] sm:text-2xl">
          Paket Özeti
        </h2>
        <p className="mt-1 text-sm text-[#888888]">
          Seçimlerini kontrol et ve sepete ekle.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-[#eeeeee] bg-white p-4 sm:p-6">
        {/* Protein */}
        {selectedProtein && (
          <SummaryRow
            label="Protein Bazı"
            name={selectedProtein.name}
            price={selectedProtein.price}
            onEdit={() => setStep(0)}
          />
        )}

        <Separator />

        {/* Flavor */}
        {selectedFlavor && (
          <SummaryRow
            label="Aroma"
            name={selectedFlavor.name}
            price={selectedFlavor.price}
            onEdit={() => setStep(1)}
          />
        )}

        {!selectedFlavor && (
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium uppercase text-[#888888]">
                Aroma
              </p>
              <p className="text-sm text-[#888888] italic">Seçilmedi</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="text-[#ff6b2c] hover:text-[#e85a1e]"
            >
              <Pencil className="mr-1 h-3 w-3" />
              Seç
            </Button>
          </div>
        )}

        <Separator />

        {/* Extras */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase text-[#888888]">
              Ekstralar
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(2)}
              className="text-[#ff6b2c] hover:text-[#e85a1e]"
            >
              <Pencil className="mr-1 h-3 w-3" />
              Düzenle
            </Button>
          </div>
          {selectedExtras.length > 0 ? (
            <div className="mt-2 space-y-2">
              {selectedExtras.map((extra) => (
                <div
                  key={extra.ingredientId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-[#555555]">{extra.name}</span>
                  <span className="font-medium text-[#1a1a1a]">
                    +{formatPrice(extra.price)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#888888] italic">Seçilmedi</p>
          )}
        </div>

        <Separator />

        {/* Bidon */}
        {selectedBidon && (
          <SummaryRow
            label="Bidon"
            name={selectedBidon.name}
            price={selectedBidon.price}
            onEdit={() => setStep(3)}
          />
        )}

        {!selectedBidon && (
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium uppercase text-[#888888]">
                Bidon
              </p>
              <p className="text-sm text-[#888888] italic">Seçilmedi</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(3)}
              className="text-[#ff6b2c] hover:text-[#e85a1e]"
            >
              <Pencil className="mr-1 h-3 w-3" />
              Seç
            </Button>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-[#1a1a1a]">Toplam</span>
          <span className="text-2xl font-bold text-[#ff6b2c]">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button onClick={prevStep} variant="outline" size="lg">
          Geri
        </Button>
        <Button
          onClick={handleAddToCart}
          className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Sepete Ekle
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  name,
  price,
  onEdit,
}: {
  label: string;
  name: string;
  price: number;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-medium uppercase text-[#888888]">{label}</p>
        <p className="text-sm font-medium text-[#1a1a1a]">{name}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#1a1a1a]">
          {formatPrice(price)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-[#ff6b2c] hover:text-[#e85a1e]"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
