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
import { slugify } from "@/lib/utils";

interface BlogPostData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  is_published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

interface BlogFormProps {
  postId?: string;
  initialData?: BlogPostData;
}

function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function BlogForm({ postId, initialData }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!postId;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    image: initialData?.image ?? "",
    is_published: initialData?.is_published ?? false,
    published_at: toDatetimeLocal(initialData?.published_at ?? null),
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
  });

  const updateField = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    updateField("title", value);
    if (!isEditing || !initialData?.slug) {
      updateField("slug", slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      image: form.image || null,
      is_published: form.is_published,
      published_at: form.published_at || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/blog-posts/${postId}`, payload);
        toast.success("Blog yazısı güncellendi.");
      } else {
        await api.post("/admin/blog-posts", payload);
        toast.success("Blog yazısı oluşturuldu.");
      }
      router.push("/admin/blog");
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
          <CardTitle>Yazı Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
            <Label>Özet</Label>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Kısa özet (liste sayfasında görünür)"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label>İçerik (HTML)</Label>
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Blog yazısı içeriği (HTML destekler)"
              rows={12}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label>Görsel URL</Label>
            <Input
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="https://... veya /uploads/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yayın & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Yayın Tarihi</Label>
              <Input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => updateField("published_at", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => updateField("is_published", checked)}
              />
              <Label>Yayında</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Meta Başlık</Label>
              <Input
                value={form.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="SEO başlığı (opsiyonel)"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Açıklama</Label>
              <Input
                value={form.meta_description}
                onChange={(e) => updateField("meta_description", e.target.value)}
                placeholder="SEO açıklaması (opsiyonel)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          İptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}
