"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { usePaginatedApi } from "@/hooks/use-api";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  parent?: { id: number; name: string } | null;
  children_count?: number;
  ingredients_count?: number;
}

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Kategori Adı",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">{row.original.slug}</div>
      </div>
    ),
  },
  {
    accessorKey: "parent",
    header: "Üst Kategori",
    cell: ({ row }) => row.original.parent?.name || "-",
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

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  const { data, isLoading, mutate } = usePaginatedApi<Category>(
    `/admin/categories?page=${page}&per_page=15`,
  );

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", sort_order: 0, is_active: true });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setEditingId(category.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, form);
        toast.success("Kategori güncellendi.");
      } else {
        await api.post("/admin/categories", form);
        toast.success("Kategori oluşturuldu.");
      }
      setDialogOpen(false);
      resetForm();
      mutate();
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Kategori silindi.");
      mutate();
    } catch {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const actionsColumn: ColumnDef<Category> = {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
          Düzenle
        </Button>
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
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <Button onClick={openCreate}>Yeni Kategori</Button>
      </div>

      <DataTable
        columns={[...columns, actionsColumn]}
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={data?.meta}
        onPageChange={setPage}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Kategori Adı</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: editingId ? f.slug : slugify(name),
                  }));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Sıralama</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, is_active: checked }))
                }
              />
              <Label>Aktif</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingId ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
