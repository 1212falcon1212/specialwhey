"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { mutate } from "swr";
import type { Address } from "@/types/user";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const addressSchema = z.object({
  title: z.string().min(1, "Adres başlığı zorunludur"),
  full_name: z.string().min(1, "Ad soyad zorunludur"),
  phone: z
    .string()
    .min(10, "Geçerli bir telefon numarası giriniz")
    .max(15, "Geçerli bir telefon numarası giriniz"),
  city: z.string().min(1, "Şehir zorunludur"),
  district: z.string().min(1, "İlçe zorunludur"),
  neighborhood: z.string(),
  address_line: z.string().min(1, "Adres satırı zorunludur"),
  zip_code: z.string(),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormDialogProps {
  address?: Address;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddressFormDialog({
  address,
  open,
  onOpenChange,
  onSuccess,
}: AddressFormDialogProps) {
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: address?.title ?? "",
      full_name: address?.full_name ?? "",
      phone: address?.phone ?? "",
      city: address?.city ?? "",
      district: address?.district ?? "",
      neighborhood: address?.neighborhood ?? "",
      address_line: address?.address_line ?? "",
      zip_code: address?.zip_code ?? "",
      is_default: address?.is_default ?? false,
    },
  });

  const isDefault = watch("is_default");

  async function onSubmit(data: AddressFormValues) {
    try {
      if (isEditing) {
        await api.put(`/account/addresses/${address.id}`, data);
        toast.success("Adres başarıyla güncellendi");
      } else {
        await api.post("/account/addresses", data);
        toast.success("Adres başarıyla eklendi");
      }
      mutate("/account/addresses");
      onSuccess();
      onOpenChange(false);
      reset();
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Adresi Düzenle" : "Yeni Adres Ekle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Adres Başlığı</Label>
            <Input
              id="title"
              placeholder="Ev, İş vb."
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="full_name">Ad Soyad</Label>
            <Input
              id="full_name"
              placeholder="Ad Soyad"
              {...register("full_name")}
              aria-invalid={!!errors.full_name}
            />
            {errors.full_name?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              placeholder="05XX XXX XX XX"
              type="tel"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* City & District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Şehir</Label>
              <Input
                id="city"
                placeholder="Şehir"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="district">İlçe</Label>
              <Input
                id="district"
                placeholder="İlçe"
                {...register("district")}
                aria-invalid={!!errors.district}
              />
              {errors.district?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.district.message}
                </p>
              )}
            </div>
          </div>

          {/* Neighborhood */}
          <div>
            <Label htmlFor="neighborhood">Mahalle (Opsiyonel)</Label>
            <Input
              id="neighborhood"
              placeholder="Mahalle"
              {...register("neighborhood")}
            />
          </div>

          {/* Address Line */}
          <div>
            <Label htmlFor="address_line">Adres</Label>
            <Textarea
              id="address_line"
              placeholder="Sokak, bina no, daire no"
              {...register("address_line")}
              aria-invalid={!!errors.address_line}
            />
            {errors.address_line?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.address_line.message}
              </p>
            )}
          </div>

          {/* Zip Code */}
          <div>
            <Label htmlFor="zip_code">Posta Kodu (Opsiyonel)</Label>
            <Input
              id="zip_code"
              placeholder="34000"
              {...register("zip_code")}
            />
          </div>

          {/* Is Default */}
          <div className="flex items-center gap-3">
            <Switch
              checked={isDefault}
              onCheckedChange={(checked: boolean) =>
                setValue("is_default", checked)
              }
            />
            <Label className="cursor-pointer">Varsayılan adres olarak ayarla</Label>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : isEditing ? (
              "Güncelle"
            ) : (
              "Kaydet"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
