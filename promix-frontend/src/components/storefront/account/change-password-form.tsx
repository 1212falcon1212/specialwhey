"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Mevcut şifre gerekli"),
    new_password: z.string().min(8, "Yeni şifre en az 8 karakter"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Şifreler eşleşmiyor",
    path: ["new_password_confirmation"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setApiError(null);
    try {
      await api.put("/account/password", data);
      reset();
      toast.success("Şifre değiştirildi.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Şifre değiştirme sırasında bir hata oluştu.";
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Şifre Değiştir</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {apiError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="current_password">Mevcut Şifre</Label>
            <Input
              id="current_password"
              type="password"
              {...register("current_password")}
            />
            {errors.current_password && (
              <p className="text-sm text-red-500">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">Yeni Şifre</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="En az 8 karakter"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-sm text-red-500">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password_confirmation">
              Yeni Şifre (Tekrar)
            </Label>
            <Input
              id="new_password_confirmation"
              type="password"
              {...register("new_password_confirmation")}
            />
            {errors.new_password_confirmation && (
              <p className="text-sm text-red-500">
                {errors.new_password_confirmation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
