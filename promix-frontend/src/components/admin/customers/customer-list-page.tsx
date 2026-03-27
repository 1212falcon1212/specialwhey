"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaginatedApi } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  orders_count: number;
  created_at: string;
}

export function CustomerListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams({ page: String(page), per_page: "15" });
  if (search) queryParams.set("search", search);

  const { data, isLoading } = usePaginatedApi<AdminCustomer>(
    `/admin/customers?${queryParams}`,
  );

  const customers = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Müşteriler</h1>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Ad, e-posta veya telefon ara..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
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
      ) : customers.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Müşteri bulunamadı.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead className="text-right">Sipariş Sayısı</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/musteriler/${customer.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {customer.name}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    {customer.orders_count}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground">
            Toplam {meta.total} müşteri
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
            >
              Önceki
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
