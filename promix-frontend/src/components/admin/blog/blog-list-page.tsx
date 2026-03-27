"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { usePaginatedApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  author: { id: number; name: string } | null;
  created_at: string;
}

export function BlogListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, mutate } = usePaginatedApi<BlogPostItem>(
    `/admin/blog-posts?page=${page}`
  );

  const posts = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async (id: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/blog-posts/${id}`);
      toast.success("Blog yazısı silindi.");
      mutate();
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Yazıları</h1>
        <Button render={<Link href="/admin/blog/yeni" />}>
          <Plus className="size-4" />
          Yeni Yazı
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border py-16 text-center">
          <p className="text-muted-foreground">Henüz blog yazısı bulunmamaktadır.</p>
          <Button className="mt-4" render={<Link href="/admin/blog/yeni" />}>
            <Plus className="size-4" />
            İlk Yazıyı Oluştur
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Yazar</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Tarih</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="font-medium text-foreground hover:text-emerald-600">
                      {post.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{post.slug}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {post.author?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    {post.is_published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Yayında</Badge>
                    ) : (
                      <Badge variant="secondary">Taslak</Badge>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {new Date(post.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" render={<Link href={`/admin/blog/${post.id}`} />}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Toplam {meta.total} yazı
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.last_page}
              onClick={() => setPage(page + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
