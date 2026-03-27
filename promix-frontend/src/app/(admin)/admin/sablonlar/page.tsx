"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { usePaginatedApi } from "@/hooks/use-api";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { MixerTemplate } from "@/types/ingredient";

const columns: ColumnDef<MixerTemplate>[] = [
  {
    accessorKey: "name",
    header: "Şablon Adı",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.slug}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Bileşen Sayısı",
    cell: ({ row }) => row.original.items?.length ?? 0,
  },
  {
    accessorKey: "is_featured",
    header: "Öne Çıkan",
    cell: ({ row }) => (
      <Badge variant={row.original.is_featured ? "default" : "outline"}>
        {row.original.is_featured ? "Evet" : "Hayır"}
      </Badge>
    ),
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
  {
    accessorKey: "sort_order",
    header: "Sıra",
  },
];

export default function MixerTemplatesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = usePaginatedApi<MixerTemplate>(
    `/admin/mixer-templates?page=${page}&per_page=15`,
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Bu şablonu silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/mixer-templates/${id}`);
      toast.success("Şablon silindi.");
      mutate();
    } catch {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const actionsColumn: ColumnDef<MixerTemplate> = {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/sablonlar/${row.original.id}`}
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
        <h1 className="text-2xl font-bold">Mixer Şablonları</h1>
        <Link
          href="/admin/sablonlar/yeni"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Yeni Şablon
        </Link>
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
