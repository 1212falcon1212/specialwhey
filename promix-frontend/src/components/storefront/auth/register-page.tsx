"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLogo } from "./auth-logo";
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
import { register as registerUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

const registerSchema = z
  .object({
    name: z.string().min(3, "Ad soyad en az 3 karakter"),
    email: z.string().email("Geçerli bir e-posta giriniz"),
    phone: z.string().optional(),
    password: z.string().min(8, "Şifre en az 8 karakter"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Şifreler eşleşmiyor",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/hesabim");
    }
  }, [mounted, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const { user, token } = await registerUser(data);
      setAuth(user, token);
      toast.success("Hesabınız oluşturuldu!");
      router.push("/");
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
      setApiError(message);
      toast.error(message);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AuthLogo />
          <CardTitle className="text-xl">Hesap Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Adınız Soyadınız"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="En az 8 karakter"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Şifre (Tekrar)</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Şifrenizi tekrar giriniz"
                {...register("password_confirmation")}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff6b2c] hover:bg-[#e85a1e]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Zaten hesabınız var mı?{" "}
              <Link
                href="/giris"
                className="font-medium text-[#ff6b2c] hover:text-[#e85a1e]"
              >
                Giriş Yap
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
