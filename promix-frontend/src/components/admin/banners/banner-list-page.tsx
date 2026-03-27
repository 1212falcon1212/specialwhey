"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  mobile_image: string | null;
  link: string | null;
  button_text: string | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  sort_order: number;
}

export function BannerListPage() {
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: "15",
  });

  const { data, isLoading, mutate } = usePaginatedApi<Banner>(
    `/admin/banners?${queryParams}`,
  );

  const banners = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async (id: number) => {
    if (!confirm("Bu banneri silmek istediginize emin misiniz?")) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      toast.success("Banner silindi.");
      mutate();
    } catch {
      toast.error("Silme islemi basarisiz.");
    }
  };

  const getDateRangeInfo = (banner: Banner): string => {
    const parts: string[] = [];
    if (banner.starts_at) {
      parts.push(
        `Baslangic: ${new Date(banner.starts_at).toLocaleDateString("tr-TR")}`,
      );
    }
    if (banner.expires_at) {
      parts.push(
        `Bitis: ${new Date(banner.expires_at).toLocaleDateString("tr-TR")}`,
      );
    }
    return parts.join(" - ");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bannerlar</h1>
        <Link
          href="/admin/bannerlar/yeni"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Yeni Banner
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Banner bulunamadi.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gorsel</TableHead>
                <TableHead>Baslik</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Sira</TableHead>
                <TableHead>Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-12 w-20 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                        Yok
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{banner.title}</div>
                      {banner.subtitle && (
                        <div className="text-xs text-muted-foreground">
                          {banner.subtitle}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {banner.link || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={banner.is_active ? "default" : "secondary"}
                      >
                        {banner.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                      {(banner.starts_at || banner.expires_at) && (
                        <div className="text-xs text-muted-foreground">
                          {getDateRangeInfo(banner)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{banner.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/bannerlar/${banner.id}`}
                        className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted"
                      >
                        Duzenle
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(banner.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground">
            Toplam {meta.total} banner
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
            >
              Onceki
            </Button>
            <span className="text-sm text-muted-foreground">
              {meta.current_page} / {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page + 1)}
              disabled={meta.current_page >= meta.last_page}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
