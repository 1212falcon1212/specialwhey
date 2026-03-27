"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";
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
import type { Ingredient, IngredientOption, Category } from "@/types/ingredient";

interface IngredientFormProps {
  ingredient?: Ingredient;
}

interface OptionForm {
  label: string;
  amount: number;
  price: number;
  stock_quantity: number;
  is_default: boolean;
}

export function IngredientForm({ ingredient }: IngredientFormProps) {
  const router = useRouter();
  const isEditing = !!ingredient;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(ingredient?.image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", "ingredients");
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.url || res.data.url;
      setImageUrl(url);
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const { data: categoriesData } = usePaginatedApi<Category>(
    "/admin/categories?per_page=100",
  );

  const [form, setForm] = useState({
    category_id: ingredient?.category_id?.toString() || "",
    name: ingredient?.name || "",
    slug: ingredient?.slug || "",
    description: ingredient?.description || "",
    short_description: ingredient?.short_description || "",
    base_price: ingredient?.base_price || 0,
    unit: ingredient?.unit || "gram",
    unit_amount: ingredient?.unit_amount || 0,
    stock_quantity: ingredient?.stock_quantity || 0,
    sku: ingredient?.sku || "",
    is_active: ingredient?.is_active ?? true,
    is_featured: ingredient?.is_featured ?? false,
    sort_order: ingredient?.sort_order || 0,
    meta_title: ingredient?.meta_title || "",
    meta_description: ingredient?.meta_description || "",
  });

  const [nutritionalInfo, setNutritionalInfo] = useState({
    calories: ingredient?.nutritional_info?.calories ?? 0,
    protein: ingredient?.nutritional_info?.protein ?? 0,
    carbs: ingredient?.nutritional_info?.carbs ?? 0,
    fat: ingredient?.nutritional_info?.fat ?? 0,
    fiber: ingredient?.nutritional_info?.fiber ?? 0,
  });

  const updateNutrition = (key: string, value: number) => {
    setNutritionalInfo((n) => ({ ...n, [key]: value }));
  };

  const [options, setOptions] = useState<OptionForm[]>(
    ingredient?.options?.map((o: IngredientOption) => ({
      label: o.label,
      amount: o.amount,
      price: o.price,
      stock_quantity: o.stock_quantity,
      is_default: o.is_default,
    })) || [],
  );

  const updateField = (key: string, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const addOption = () => {
    setOptions((o) => [
      ...o,
      { label: "", amount: 0, price: 0, stock_quantity: 0, is_default: false },
    ]);
  };

  const removeOption = (index: number) => {
    setOptions((o) => o.filter((_, i) => i !== index));
  };

  const updateOption = (
    index: number,
    key: keyof OptionForm,
    value: string | number | boolean,
  ) => {
    setOptions((o) =>
      o.map((opt, i) => (i === index ? { ...opt, [key]: value } : opt)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      image: imageUrl || null,
      category_id: Number(form.category_id),
      base_price: Number(form.base_price),
      unit_amount: Number(form.unit_amount),
      stock_quantity: Number(form.stock_quantity),
      sort_order: Number(form.sort_order),
      nutritional_info: nutritionalInfo,
      options: options.length > 0 ? options : undefined,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/ingredients/${ingredient.id}`, payload);
        toast.success("Bileşen güncellendi.");
      } else {
        await api.post("/admin/ingredients", payload);
        toast.success("Bileşen oluşturuldu.");
      }
      router.push("/admin/bilesenler");
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
              <Label>Kategori</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => v !== null && updateField("category_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bileşen Adı</Label>
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
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kısa Açıklama</Label>
            <Input
              value={form.short_description}
              onChange={(e) =>
                updateField("short_description", e.target.value)
              }
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label>Açıklama (HTML destekli)</Label>
            <RichTextEditor
              value={form.description}
              onChange={(val) => updateField("description", val)}
              placeholder="Bileşen hakkında detaylı açıklama yazın..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Görsel</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {imageUrl ? (
            <div className="flex items-start gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt="Bileşen görseli"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="mr-1.5 size-4 animate-spin" /> Yükleniyor</>
                  ) : (
                    <><ImagePlus className="mr-1.5 size-4" /> Değiştir</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => setImageUrl("")}
                >
                  <Trash2 className="mr-1.5 size-4" /> Kaldır
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
            >
              {uploading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-5 animate-spin" />
                  Yükleniyor...
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-sm">Görsel yüklemek için tıklayın</span>
                  <span className="text-xs">JPG, PNG, WebP — Maks. 5MB</span>
                </div>
              )}
            </button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fiyat & Stok</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Fiyat (TL)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.base_price}
                onChange={(e) =>
                  updateField("base_price", Number(e.target.value))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Birim</Label>
              <Select
                value={form.unit}
                onValueChange={(v) => v !== null && updateField("unit", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gram">Gram</SelectItem>
                  <SelectItem value="ml">Mililitre</SelectItem>
                  <SelectItem value="adet">Adet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Birim Miktarı</Label>
              <Input
                type="number"
                step="0.01"
                value={form.unit_amount}
                onChange={(e) =>
                  updateField("unit_amount", Number(e.target.value))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stok</Label>
              <Input
                type="number"
                value={form.stock_quantity}
                onChange={(e) =>
                  updateField("stock_quantity", Number(e.target.value))
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Besin Değerleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Kalori (kcal)</Label>
              <Input
                type="number"
                step="0.1"
                value={nutritionalInfo.calories}
                onChange={(e) => updateNutrition("calories", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Protein (g)</Label>
              <Input
                type="number"
                step="0.1"
                value={nutritionalInfo.protein}
                onChange={(e) => updateNutrition("protein", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Karbonhidrat (g)</Label>
              <Input
                type="number"
                step="0.1"
                value={nutritionalInfo.carbs}
                onChange={(e) => updateNutrition("carbs", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Yağ (g)</Label>
              <Input
                type="number"
                step="0.1"
                value={nutritionalInfo.fat}
                onChange={(e) => updateNutrition("fat", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Lif (g)</Label>
              <Input
                type="number"
                step="0.1"
                value={nutritionalInfo.fiber}
                onChange={(e) => updateNutrition("fiber", Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seçenekler (Gramaj)</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              Seçenek Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz seçenek eklenmedi.
            </p>
          ) : (
            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 rounded-md border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Etiket</Label>
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        updateOption(index, "label", e.target.value)
                      }
                      placeholder="ör: 500g"
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Miktar</Label>
                    <Input
                      type="number"
                      value={option.amount}
                      onChange={(e) =>
                        updateOption(index, "amount", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="w-28 space-y-1">
                    <Label className="text-xs">Fiyat (TL)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={option.price}
                      onChange={(e) =>
                        updateOption(index, "price", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Stok</Label>
                    <Input
                      type="number"
                      value={option.stock_quantity}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "stock_quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={option.is_default}
                      onCheckedChange={(checked) =>
                        updateOption(index, "is_default", checked)
                      }
                    />
                    <Label className="text-xs">Varsayılan</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeOption(index)}
                  >
                    Sil
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Ayarlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Meta Başlık</Label>
              <Input
                value={form.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
              />
            </div>
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
          </div>
          <div className="space-y-2">
            <Label>Meta Açıklama</Label>
            <Textarea
              value={form.meta_description}
              onChange={(e) =>
                updateField("meta_description", e.target.value)
              }
              maxLength={500}
            />
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label>Aktif</Label>
            </div>
            <div className="flex items-center gap-2">
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/bilesenler")}
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
