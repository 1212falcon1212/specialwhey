"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BannerData {
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

interface BannerFormProps {
  bannerId?: string;
  initialData?: BannerData;
}

function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function BannerForm({ bannerId, initialData }: BannerFormProps) {
  const router = useRouter();
  const isEditing = !!bannerId;
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const mobileImageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    image: initialData?.image || "",
    mobile_image: initialData?.mobile_image || "",
    link: initialData?.link || "",
    button_text: initialData?.button_text || "",
    position: initialData?.position || "hero",
    starts_at: toDatetimeLocal(initialData?.starts_at ?? null),
    expires_at: toDatetimeLocal(initialData?.expires_at ?? null),
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
  });

  const updateField = (key: string, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleImageUpload = async (field: "image" | "mobile_image", file: File) => {
    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", "banners");
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.url || res.data.url;
      updateField(field, url);
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      image: form.image,
      mobile_image: form.mobile_image || null,
      link: form.link || null,
      button_text: form.button_text || null,
      position: form.position,
      starts_at: form.starts_at || null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
    };

    try {
      if (isEditing) {
        await api.put(`/admin/banners/${bannerId}`, payload);
        toast.success("Banner güncellendi.");
      } else {
        await api.post("/admin/banners", payload);
        toast.success("Banner oluşturuldu.");
      }
      router.push("/admin/bannerlar");
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  function ImageUploadField({
    label,
    field,
    inputRef,
  }: {
    label: string;
    field: "image" | "mobile_image";
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) {
    const value = form[field];
    const isUploading = uploadingField === field;

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(field, f);
            e.target.value = "";
          }}
        />
        {value ? (
          <div className="space-y-2">
            <div className="relative h-40 overflow-hidden rounded-lg border bg-muted">
              <Image src={value} alt={label} fill className="object-cover" unoptimized />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? <><Loader2 className="mr-1.5 size-4 animate-spin" />Yükleniyor</> : <><ImagePlus className="mr-1.5 size-4" />Değiştir</>}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => updateField(field, "")}
              >
                <Trash2 className="mr-1.5 size-4" />Kaldır
              </Button>
            </div>
            <Input
              value={value}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder="veya URL girin"
              className="text-xs"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
            >
              {isUploading ? (
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" />Yükleniyor...</span>
              ) : (
                <span className="flex flex-col items-center gap-1 text-muted-foreground"><ImagePlus className="size-6" /><span className="text-xs">Görsel yükle</span></span>
              )}
            </button>
            <Input
              value={value}
              onChange={(e) => updateField(field, e.target.value)}
              placeholder="veya görsel URL'si girin"
              className="text-xs"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Başlık</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Opsiyonel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={form.link}
                onChange={(e) => updateField("link", e.target.value)}
                placeholder="Opsiyonel - örn: /proteinini-olustur"
              />
            </div>
            <div className="space-y-2">
              <Label>Buton Metni</Label>
              <Input
                value={form.button_text}
                onChange={(e) => updateField("button_text", e.target.value)}
                placeholder="Opsiyonel - örn: Keşfet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pozisyon</Label>
            <select
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="hero">Hero Banner</option>
              <option value="lifestyle">Lifestyle Gallery</option>
              <option value="process">Süreç Kartları</option>
              <option value="fullwidth_promo">Tam Genişlik Promo</option>
              <option value="sidebar">Sidebar</option>
              <option value="category_promo">Kategori Promo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Görseller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ImageUploadField label="Banner Görseli" field="image" inputRef={imageRef} />
            <ImageUploadField label="Mobil Görsel (Opsiyonel)" field="mobile_image" inputRef={mobileImageRef} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zamanlama & Durum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Başlangıç Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => updateField("starts_at", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bitiş Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => updateField("expires_at", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Sıralama</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label>Aktif</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/bannerlar")}>
          İptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
