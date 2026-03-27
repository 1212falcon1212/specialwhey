"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { mutate } from "swr";
import { toast } from "sonner";
import type { Address } from "@/types/user";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddressFormDialog } from "./address-form-dialog";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

export function AddressListPage() {
  const { data, isLoading, error } = useApi<Address[]>("/account/addresses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(
    undefined
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const addresses = data?.data ?? [];

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  function handleAdd() {
    setEditingAddress(undefined);
    setDialogOpen(true);
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await api.delete(`/account/addresses/${id}`);
      toast.success("Adres başarıyla silindi");
      mutate("/account/addresses");
    } catch {
      toast.error("Adres silinirken bir hata oluştu");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Adresler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adreslerim</h1>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-1 size-4" />
          Yeni Adres Ekle
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <MapPin className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Henüz kayıtlı adresiniz yok.
          </p>
          <Button onClick={handleAdd} className="mt-4" variant="outline">
            <Plus className="mr-1 size-4" />
            İlk Adresinizi Ekleyin
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="relative p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{address.title}</h3>
                    {address.is_default && (
                      <Badge className="rounded-md border-0 bg-[rgba(255,107,44,0.12)] text-xs text-[#ff6b2c]">
                        Varsayılan
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={deletingId === address.id}
                          />
                        }
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu adresi silmek istediğinize emin misiniz? Bu işlem
                            geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(address.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {address.full_name}
                  </p>
                  <p>{address.phone}</p>
                  <p>
                    {address.neighborhood
                      ? `${address.neighborhood}, `
                      : ""}
                    {address.address_line}
                  </p>
                  <p>
                    {address.district} / {address.city}
                    {address.zip_code ? ` - ${address.zip_code}` : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog
        address={editingAddress}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => mutate("/account/addresses")}
      />
    </div>
  );
}
