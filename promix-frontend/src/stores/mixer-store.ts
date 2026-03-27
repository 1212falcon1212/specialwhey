import { create } from "zustand";
import type { CartItem, MixerCartItem } from "@/types/cart";

interface SelectedItem {
  ingredientId: number;
  optionId?: number;
  name: string;
  price: number;
  image?: string;
}

interface MixerState {
  currentStep: number;
  selectedProtein: SelectedItem | null;
  selectedFlavor: SelectedItem | null;
  selectedExtras: SelectedItem[];
  selectedBidon: SelectedItem | null;
  totalPrice: number;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectProtein: (item: SelectedItem) => void;
  selectFlavor: (item: SelectedItem) => void;
  toggleExtra: (item: SelectedItem) => void;
  selectBidon: (item: SelectedItem) => void;
  calculateTotal: () => void;
  reset: () => void;
  toCartItem: () => CartItem;
}

export const useMixerStore = create<MixerState>()((set, get) => ({
  currentStep: 0,
  selectedProtein: null,
  selectedFlavor: null,
  selectedExtras: [],
  selectedBidon: null,
  totalPrice: 0,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  selectProtein: (item) => {
    set({ selectedProtein: item });
    get().calculateTotal();
  },

  selectFlavor: (item) => {
    set({ selectedFlavor: item });
    get().calculateTotal();
  },

  toggleExtra: (item) => {
    set((state) => {
      const exists = state.selectedExtras.find(
        (e) => e.ingredientId === item.ingredientId,
      );
      const selectedExtras = exists
        ? state.selectedExtras.filter(
            (e) => e.ingredientId !== item.ingredientId,
          )
        : [...state.selectedExtras, item];
      return { selectedExtras };
    });
    get().calculateTotal();
  },

  selectBidon: (item) => {
    set({ selectedBidon: item });
    get().calculateTotal();
  },

  calculateTotal: () => {
    const { selectedProtein, selectedFlavor, selectedExtras, selectedBidon } = get();
    let total = 0;
    if (selectedProtein) total += selectedProtein.price;
    if (selectedFlavor) total += selectedFlavor.price;
    selectedExtras.forEach((extra) => {
      total += extra.price;
    });
    if (selectedBidon) total += selectedBidon.price;
    set({ totalPrice: total });
  },

  reset: () =>
    set({
      currentStep: 0,
      selectedProtein: null,
      selectedFlavor: null,
      selectedExtras: [],
      selectedBidon: null,
      totalPrice: 0,
    }),

  toCartItem: () => {
    const { selectedProtein, selectedFlavor, selectedExtras, selectedBidon, totalPrice } =
      get();
    const mixerItems: MixerCartItem[] = [];

    if (selectedProtein) {
      mixerItems.push({
        ingredientId: selectedProtein.ingredientId,
        optionId: selectedProtein.optionId,
        name: selectedProtein.name,
        price: selectedProtein.price,
      });
    }

    if (selectedFlavor) {
      mixerItems.push({
        ingredientId: selectedFlavor.ingredientId,
        optionId: selectedFlavor.optionId,
        name: selectedFlavor.name,
        price: selectedFlavor.price,
      });
    }

    selectedExtras.forEach((extra) => {
      mixerItems.push({
        ingredientId: extra.ingredientId,
        optionId: extra.optionId,
        name: extra.name,
        price: extra.price,
      });
    });

    if (selectedBidon) {
      mixerItems.push({
        ingredientId: selectedBidon.ingredientId,
        optionId: selectedBidon.optionId,
        name: selectedBidon.name,
        price: selectedBidon.price,
      });
    }

    const id = `mixer_${Date.now()}`;
    const names = mixerItems.map((i) => i.name).join(" + ");

    return {
      id,
      type: "mixer" as const,
      name: `Özel Paket: ${names}`,
      image: selectedProtein?.image || null,
      price: totalPrice,
      quantity: 1,
      mixerItems,
    };
  },
}));
