"use client";

import { useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ChangePasswordForm } from "./change-password-form";
import type { User } from "@/types/user";
import type { ApiError } from "@/types/api";

const profileSchema = z.object({
  name: z.string().min(3, "Ad soyad en az 3 karakter"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

export function ProfilePage() {
  const { data, error, isLoading, mutate } = useApi<User>("/account/profile");
  const setUser = useAuthStore((s) => s.setUser);

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      const response = await api.put("/account/profile", formData);
      const updatedUser = response.data.data as User;
      setUser(updatedUser);
      await mutate();
      toast.success("Profil güncellendi.");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message || "Profil güncellenirken bir hata oluştu.";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">Profil bilgileri yüklenirken bir hata oluştu.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => mutate()}
          >
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profil Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Ad Soyad</Label>
              <Input
                id="profile-name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">E-posta</Label>
              <Input
                id="profile-email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-[#f5f5f3]"
              />
              <p className="text-xs text-muted-foreground">
                E-posta adresi değiştirilemez.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefon</Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="bg-[#ff6b2c] hover:bg-[#e85a1e]"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <ChangePasswordForm />
    </div>
  );
}
