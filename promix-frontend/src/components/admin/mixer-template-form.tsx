"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { usePaginatedApi } from "@/hooks/use-api";
import type {
  MixerTemplate,
  MixerTemplateItem,
  Ingredient,
} from "@/types/ingredient";

interface MixerTemplateFormProps {
  template?: MixerTemplate;
}

interface ItemForm {
  ingredient_id: string;
  ingredient_option_id: string;
  is_required: boolean;
  sort_order: number;
}

export function MixerTemplateForm({ template }: MixerTemplateFormProps) {
  const router = useRouter();
  const isEditing = !!template;
  const [loading, setLoading] = useState(false);

  const { data: ingredientsData } = usePaginatedApi<Ingredient>(
    "/admin/ingredients?per_page=100",
  );

  const [form, setForm] = useState({
    name: template?.name || "",
    slug: template?.slug || "",
    description: template?.description || "",
    is_active: template?.is_active ?? true,
    is_featured: template?.is_featured ?? false,
    sort_order: template?.sort_order || 0,
  });

  const [items, setItems] = useState<ItemForm[]>(
    template?.items?.map((item: MixerTemplateItem) => ({
      ingredient_id: String(item.ingredient_id),
      ingredient_option_id: item.ingredient_option_id
        ? String(item.ingredient_option_id)
        : "",
      is_required: item.is_required,
      sort_order: item.sort_order,
    })) || [],
  );

  const updateField = (key: string, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const addItem = () => {
    setItems((i) => [
      ...i,
      {
        ingredient_id: "",
        ingredient_option_id: "",
        is_required: false,
        sort_order: i.length,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((i) => i.filter((_, idx) => idx !== index));
  };

  const updateItem = (
    index: number,
    key: keyof ItemForm,
    value: string | number | boolean,
  ) => {
    setItems((i) =>
      i.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    );
  };

  const getIngredientOptions = (ingredientId: string) => {
    const ingredient = ingredientsData?.data?.find(
      (ing) => String(ing.id) === ingredientId,
    );
    return ingredient?.options || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      sort_order: Number(form.sort_order),
      items: items.map((item) => ({
        ingredient_id: Number(item.ingredient_id),
        ingredient_option_id: item.ingredient_option_id
          ? Number(item.ingredient_option_id)
          : null,
        is_required: item.is_required,
        sort_order: Number(item.sort_order),
      })),
    };

    try {
      if (isEditing) {
        await api.put(`/admin/mixer-templates/${template.id}`, payload);
        toast.success("Şablon güncellendi.");
      } else {
        await api.post("/admin/mixer-templates", payload);
        toast.success("Şablon oluşturuldu.");
      }
      router.push("/admin/sablonlar");
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Şablon Adı</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  updateField("name", name);
                  if (!isEditing) updateField("slug", slugify(name));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Açıklama</Label>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Sıralama</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  updateField("sort_order", Number(e.target.value))
                }
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  updateField("is_active", checked)
                }
              />
              <Label>Aktif</Label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(checked) =>
                  updateField("is_featured", checked)
                }
              />
              <Label>Öne Çıkan</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Şablon Bileşenleri</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              Bileşen Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz bileşen eklenmedi.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Bileşen</Label>
                    <Select
                      value={item.ingredient_id}
                      onValueChange={(v) =>
                        v !== null && updateItem(index, "ingredient_id", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bileşen seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredientsData?.data?.map((ing) => (
                          <SelectItem key={ing.id} value={String(ing.id)}>
                            {ing.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {item.ingredient_id &&
                    getIngredientOptions(item.ingredient_id).length > 0 && (
                      <div className="w-40 space-y-1">
                        <Label className="text-xs">Seçenek</Label>
                        <Select
                          value={item.ingredient_option_id}
                          onValueChange={(v) =>
                            v !== null && updateItem(index, "ingredient_option_id", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seçenek" />
                          </SelectTrigger>
                          <SelectContent>
                            {getIngredientOptions(item.ingredient_id).map(
                              (opt) => (
                                <SelectItem
                                  key={opt.id}
                                  value={String(opt.id)}
                                >
                                  {opt.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Sıra</Label>
                    <Input
                      type="number"
                      value={item.sort_order}
                      onChange={(e) =>
                        updateItem(index, "sort_order", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Switch
                      checked={item.is_required}
                      onCheckedChange={(checked) =>
                        updateItem(index, "is_required", checked)
                      }
                    />
                    <Label className="text-xs">Zorunlu</Label>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeItem(index)}
                  >
                    Sil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/sablonlar")}
        >
          İptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Kaydediliyor..."
            : isEditing
              ? "Güncelle"
              : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
