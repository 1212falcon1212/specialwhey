"use client";

import { useMixerStore } from "@/stores/mixer-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MixerMobileBottomBar() {
  const {
    currentStep,
    totalPrice,
    selectedProtein,
    selectedFlavor,
    nextStep,
    prevStep,
    toCartItem,
    reset,
  } = useMixerStore();
  const { addItem, setDrawerOpen } = useCartStore();

  const isSummaryStep = currentStep === 4;

  const canProceed =
    currentStep === 0
      ? !!selectedProtein
      : currentStep === 1
        ? !!selectedFlavor
        : true;

  function handleAddToCart() {
    const cartItem = toCartItem();
    addItem(cartItem);
    setDrawerOpen(true);
    reset();
  }

  function handleNext() {
    if (isSummaryStep) {
      handleAddToCart();
    } else {
      nextStep();
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eeeeee] bg-white p-4 shadow-lg lg:hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#888888]">Toplam</p>
            <p className="text-lg font-bold text-[#1a1a1a]">
              {formatPrice(totalPrice)}
            </p>
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button onClick={prevStep} variant="outline" size="sm">
                Geri
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-[#ff6b2c] hover:bg-[#e85a1e] disabled:opacity-50"
              size="sm"
            >
              {isSummaryStep ? (
                <>
                  <ShoppingCart className="mr-1.5 h-4 w-4" />
                  Sepete Ekle
                </>
              ) : (
                <>
                  Devam
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
