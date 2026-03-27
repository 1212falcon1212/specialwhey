import { create } from "zustand";

interface CheckoutState {
  paymentToken: string | null;
  iframeUrl: string | null;
  orderNumber: string | null;
  setPaymentData: (token: string, iframeUrl: string, orderNumber: string) => void;
  clear: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  paymentToken: null,
  iframeUrl: null,
  orderNumber: null,
  setPaymentData: (token, iframeUrl, orderNumber) =>
    set({ paymentToken: token, iframeUrl, orderNumber }),
  clear: () => set({ paymentToken: null, iframeUrl: null, orderNumber: null }),
}));
