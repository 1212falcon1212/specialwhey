"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const updateField = (
    key: string,
    value: string | number | boolean,
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
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
        toast.success("Banner guncellendi.");
      } else {
        await api.post("/admin/banners", payload);
        toast.success("Banner olusturuldu.");
      }
      router.push("/admin/bannerlar");
    } catch {
      toast.error("Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Baslik</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Baslik</Label>
              <Input
                value={form.subtitle}
                onChange={(e) =>
                  updateField("subtitle", e.target.value)
                }
                placeholder="Opsiyonel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Gorsel URL</Label>
              <Input
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://... veya /uploads/..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mobil Gorsel URL</Label>
              <Input
                value={form.mobile_image}
                onChange={(e) =>
                  updateField("mobile_image", e.target.value)
                }
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
                placeholder="Opsiyonel - orn: /urunler"
              />
            </div>
            <div className="space-y-2">
              <Label>Buton Metni</Label>
              <Input
                value={form.button_text}
                onChange={(e) =>
                  updateField("button_text", e.target.value)
                }
                placeholder="Opsiyonel - orn: Alisdverise Basla"
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
              <option value="sidebar">Sidebar Banner</option>
              <option value="category_promo">Kategori Promo</option>
              <option value="fullwidth_promo">Tam Genişlik Promo</option>
            </select>
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
              <Label>Baslangic Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) =>
                  updateField("starts_at", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bitis Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) =>
                  updateField("expires_at", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Siralama</Label>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/bannerlar")}
        >
          Iptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Kaydediliyor..."
            : isEditing
              ? "Guncelle"
              : "Olustur"}
        </Button>
      </div>
    </form>
  );
}
