"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { BannerForm } from "@/components/admin/banners/banner-form";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  mobile_image: string | null;
  link: string | null;
  button_text: string | null;
  position: string;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi<Banner>(`/admin/banners/${id}`);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Banner Düzenle</h1>
      <BannerForm bannerId={id} initialData={data?.data} />
    </div>
  );
}
