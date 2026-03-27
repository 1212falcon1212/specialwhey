"use client";

import { IngredientForm } from "@/components/admin/ingredient-form";

export default function NewIngredientPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yeni Bileşen</h1>
      <IngredientForm />
    </div>
  );
}
