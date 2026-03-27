"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  register: UseFormRegister<Record<string, Record<string, string>>>;
  errors: FieldErrors<Record<string, Record<string, string>>>;
  prefix: string;
}

export function AddressForm({ register, errors, prefix }: AddressFormProps) {
  const fieldErrors = (errors[prefix] ?? {}) as Record<
    string,
    { message?: string }
  >;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Full Name */}
      <div className="sm:col-span-2">
        <Label htmlFor={`${prefix}.full_name`}>Ad Soyad</Label>
        <Input
          id={`${prefix}.full_name`}
          placeholder="Ad Soyad"
          {...register(`${prefix}.full_name`)}
          aria-invalid={!!fieldErrors.full_name}
        />
        {fieldErrors.full_name?.message && (
          <p className="mt-1 text-xs text-destructive">
            {fieldErrors.full_name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="sm:col-span-2">
        <Label htmlFor={`${prefix}.phone`}>Telefon</Label>
        <Input
          id={`${prefix}.phone`}
          placeholder="05XX XXX XX XX"
          type="tel"
          {...register(`${prefix}.phone`)}
          aria-invalid={!!fieldErrors.phone}
        />
        {fieldErrors.phone?.message && (
          <p className="mt-1 text-xs text-destructive">
            {fieldErrors.phone.message}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <Label htmlFor={`${prefix}.city`}>Şehir</Label>
        <Input
          id={`${prefix}.city`}
          placeholder="Şehir"
          {...register(`${prefix}.city`)}
          aria-invalid={!!fieldErrors.city}
        />
        {fieldErrors.city?.message && (
          <p className="mt-1 text-xs text-destructive">
            {fieldErrors.city.message}
          </p>
        )}
      </div>

      {/* District */}
      <div>
        <Label htmlFor={`${prefix}.district`}>İlçe</Label>
        <Input
          id={`${prefix}.district`}
          placeholder="İlçe"
          {...register(`${prefix}.district`)}
          aria-invalid={!!fieldErrors.district}
        />
        {fieldErrors.district?.message && (
          <p className="mt-1 text-xs text-destructive">
            {fieldErrors.district.message}
          </p>
        )}
      </div>

      {/* Address Line */}
      <div className="sm:col-span-2">
        <Label htmlFor={`${prefix}.address_line`}>Adres</Label>
        <Input
          id={`${prefix}.address_line`}
          placeholder="Mahalle, sokak, bina no, daire no"
          {...register(`${prefix}.address_line`)}
          aria-invalid={!!fieldErrors.address_line}
        />
        {fieldErrors.address_line?.message && (
          <p className="mt-1 text-xs text-destructive">
            {fieldErrors.address_line.message}
          </p>
        )}
      </div>

      {/* Zip Code */}
      <div>
        <Label htmlFor={`${prefix}.zip_code`}>Posta Kodu (Opsiyonel)</Label>
        <Input
          id={`${prefix}.zip_code`}
          placeholder="34000"
          {...register(`${prefix}.zip_code`)}
        />
      </div>
    </div>
  );
}
