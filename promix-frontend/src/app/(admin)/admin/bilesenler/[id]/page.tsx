"use client";

import { use } from "react";
import { useApi } from "@/hooks/use-api";
import { IngredientForm } from "@/components/admin/ingredient-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ingredient } from "@/types/ingredient";

export default function EditIngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi<Ingredient>(`/admin/ingredients/${id}`);

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
      <h1 className="mb-6 text-2xl font-bold">Bileşen Düzenle</h1>
      <IngredientForm ingredient={data?.data} />
    </div>
  );
}
