"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { PageForm } from "@/components/admin/pages/page-form";
import { Skeleton } from "@/components/ui/skeleton";

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi<PageData>(`/admin/pages/${id}`);

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
      <h1 className="mb-6 text-2xl font-bold">Sayfa Düzenle</h1>
      <PageForm pageId={id} initialData={data?.data} />
    </div>
  );
}
