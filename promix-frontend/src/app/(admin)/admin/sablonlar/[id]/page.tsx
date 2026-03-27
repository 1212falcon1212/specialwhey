"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { MixerTemplateForm } from "@/components/admin/mixer-template-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { MixerTemplate } from "@/types/ingredient";

export default function EditMixerTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi<MixerTemplate>(
    `/admin/mixer-templates/${id}`,
  );

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
      <h1 className="mb-6 text-2xl font-bold">Şablon Düzenle</h1>
      <MixerTemplateForm template={data?.data} />
    </div>
  );
}
