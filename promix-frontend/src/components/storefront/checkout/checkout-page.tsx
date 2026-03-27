"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { AddressForm } from "./address-form";
import type { CartItem } from "@/types/cart";
import type { ApiResponse, ApiError } from "@/types/api";
import type { Order } from "@/types/order";
import { AxiosError } from "axios";

const addressSchema = z.object({
  full_name: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  city: z.string().min(2, "Şehir seçiniz"),
  district: z.string().min(2, "İlçe giriniz"),
  address_line: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  zip_code: z.string().optional(),
});

const checkoutSchema = z
  .object({
    billing_address: addressSchema,
    use_different_shipping: z.boolean(),
    shipping_address: addressSchema.optional(),
    notes: z.string().max(500, "Notlar en fazla 500 karakter olabilir").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.use_different_shipping && !data.shipping_address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Teslimat adresi gereklidir",
        path: ["shipping_address"],
      });
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface PaymentResponse {
  order: Order;
  payment: {
    token: string;
    iframe_url: string;
  };
}

function transformCartItems(items: CartItem[]) {
  return items.map((item) => {
    if (item.type === "mixer") {
      return {
        type: "mixer" as const,
        quantity: item.quantity,
        mixer_items: (item.mixerItems ?? []).map((mi) => ({
          ingredient_id: mi.ingredientId,
          option_id: mi.optionId,
        })),
      };
    }
    return {
      type: "ingredient" as const,
      ingredient_id: item.ingredientId,
      option_id: item.optionId,
      quantity: item.quantity,
    };
  });
}

export function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setPaymentData = useCheckoutStore((s) => s.setPaymentData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      use_different_shipping: false,
      notes: "",
    },
  });

  const useDifferentShipping = watch("use_different_shipping");

  useEffect(() => {
    useCartStore.persist.rehydrate();
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) {
      router.replace("/sepet");
    }
  }, [mounted, items.length, router]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const total = totalPrice();

  const onSubmit = async (data: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        items: transformCartItems(items),
        billing_address: data.billing_address,
        shipping_address: data.use_different_shipping
          ? data.shipping_address
          : undefined,
        notes: data.notes || undefined,
      };

      const response = await api.post<ApiResponse<PaymentResponse>>(
        "/checkout",
        payload,
      );

      const { order, payment } = response.data.data;
      setPaymentData(payment.token, payment.iframe_url, order.order_number);
      router.push("/odeme/onayla");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ??
        "Bir hata oluştu. Lütfen tekrar deneyin.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Ödeme</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Address Forms */}
          <div className="space-y-6 lg:col-span-2">
            {/* Billing Address */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Fatura Adresi</h2>
              <AddressForm
                register={register as never}
                errors={errors as never}
                prefix="billing_address"
              />
            </Card>

            {/* Different Shipping Toggle */}
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="use_different_shipping"
                  checked={useDifferentShipping}
                  onCheckedChange={(checked: boolean) => {
                    setValue("use_different_shipping", checked);
                  }}
                />
                <Label
                  htmlFor="use_different_shipping"
                  className="cursor-pointer"
                >
                  Farklı teslimat adresi kullan
                </Label>
              </div>

              {useDifferentShipping && (
                <div className="mt-4">
                  <h2 className="mb-4 text-lg font-semibold">
                    Teslimat Adresi
                  </h2>
                  <AddressForm
                    register={register as never}
                    errors={errors as never}
                    prefix="shipping_address"
                  />
                </div>
              )}
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Sipariş Notları (Opsiyonel)
              </h2>
              <Textarea
                placeholder="Siparişinizle ilgili eklemek istediğiniz notları buraya yazabilirsiniz..."
                {...register("notes")}
                rows={3}
              />
              {errors.notes?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.notes.message}
                </p>
              )}
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h2 className="text-lg font-semibold">Sipariş Özeti</h2>
              <Separator className="my-4" />

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="ml-1">x{item.quantity}</span>
                      )}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className="text-[#ff6b2c]">Ücretsiz</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold">
                <span>Toplam</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  "Ödemeye Geç"
                )}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
