"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  sort_order: number;
}

interface PageFormProps {
  pageId?: string;
  initialData?: PageData;
}

export function PageForm({ pageId, initialData }: PageFormProps) {
  const router = useRouter();
  const isEditing = !!pageId;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
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
      slug: form.slug,
      content: form.content,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
    };

    try {
      if (isEditing) {
        await api.put(`/admin/pages/${pageId}`, payload);
        toast.success("Sayfa guncellendi.");
      } else {
        await api.post("/admin/pages", payload);
        toast.success("Sayfa olusturuldu.");
      }
      router.push("/admin/sayfalar");
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
          <CardTitle>Sayfa Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Baslik</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  updateField("title", title);
                  if (!isEditing) updateField("slug", slugify(title));
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
            <Label>Icerik</Label>
            <Textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              className="min-h-[300px]"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Ayarlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Meta Baslik</Label>
              <Input
                value={form.meta_title}
                onChange={(e) =>
                  updateField("meta_title", e.target.value)
                }
                placeholder="Opsiyonel"
              />
            </div>
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
          </div>
          <div className="space-y-2">
            <Label>Meta Aciklama</Label>
            <Textarea
              value={form.meta_description}
              onChange={(e) =>
                updateField("meta_description", e.target.value)
              }
              maxLength={500}
              placeholder="Opsiyonel"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) =>
                updateField("is_active", checked)
              }
            />
            <Label>Aktif</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/sayfalar")}
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
