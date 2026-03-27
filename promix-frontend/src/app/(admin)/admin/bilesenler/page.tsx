"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { usePaginatedApi } from "@/hooks/use-api";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { Ingredient } from "@/types/ingredient";

const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: "Bileşen Adı",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          SKU: {row.original.sku || "-"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const cat = row.original.category;
      return cat ? cat.name : "-";
    },
  },
  {
    accessorKey: "base_price",
    header: "Fiyat",
    cell: ({ row }) => formatPrice(row.original.base_price),
  },
  {
    accessorKey: "stock_quantity",
    header: "Stok",
    cell: ({ row }) => {
      const qty = row.original.stock_quantity;
      return (
        <span className={qty < 10 ? "font-medium text-red-600" : ""}>
          {qty}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Durum",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Aktif" : "Pasif"}
      </Badge>
    ),
  },
];

export default function IngredientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: "15",
  });
  if (search) queryParams.set("search", search);

  const { data, isLoading, mutate } = usePaginatedApi<Ingredient>(
    `/admin/ingredients?${queryParams}`,
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Bu bileşeni silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/ingredients/${id}`);
      toast.success("Bileşen silindi.");
      mutate();
    } catch {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const actionsColumn: ColumnDef<Ingredient> = {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/bilesenler/${row.original.id}`}
          className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted"
        >
          Düzenle
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600"
          onClick={() => handleDelete(row.original.id)}
        >
          Sil
        </Button>
      </div>
    ),
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bileşenler</h1>
        <Link
          href="/admin/bilesenler/yeni"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Yeni Bileşen
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Bileşen ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={[...columns, actionsColumn]}
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={setPage}
      />
    </div>
  );
}
