"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
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

interface PageItem {
  id: number;
  title: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export function PageListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: "15",
  });
  if (search) queryParams.set("search", search);

  const { data, isLoading, mutate } = usePaginatedApi<PageItem>(
    `/admin/pages?${queryParams}`,
  );

  const pages = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async (id: number) => {
    if (!confirm("Bu sayfayi silmek istediginize emin misiniz?")) return;
    try {
      await api.delete(`/admin/pages/${id}`);
      toast.success("Sayfa silindi.");
      mutate();
    } catch {
      toast.error("Silme islemi basarisiz.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sayfalar</h1>
        <Link
          href="/admin/sayfalar/yeni"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Yeni Sayfa
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Sayfa ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : pages.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Sayfa bulunamadi.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Baslik</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Sira</TableHead>
                <TableHead>Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((pageItem) => (
                <TableRow key={pageItem.id}>
                  <TableCell className="font-medium">
                    {pageItem.title}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    /{pageItem.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={pageItem.is_active ? "default" : "secondary"}
                    >
                      {pageItem.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{pageItem.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/sayfalar/${pageItem.id}`}
                        className="inline-flex h-7 items-center rounded-md px-2.5 text-sm font-medium hover:bg-muted"
                      >
                        Duzenle
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(pageItem.id)}
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
            Toplam {meta.total} sayfa
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
