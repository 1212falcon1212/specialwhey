"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { mutate } from "swr";
import { toast } from "sonner";
import type { SavedCard } from "@/types/saved-card";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CreditCard, Trash2, Star } from "lucide-react";

function getCardBrandDisplay(brand: string | null): string {
  if (!brand) return "Kart";
  const brands: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    troy: "Troy",
  };
  return brands[brand.toLowerCase()] ?? brand;
}

export function SavedCardsPage() {
  const { data, isLoading, error } =
    useApi<SavedCard[]>("/account/saved-cards");
  const [actioningId, setActioningId] = useState<number | null>(null);

  const cards = data?.data ?? [];

  async function handleSetDefault(id: number) {
    setActioningId(id);
    try {
      await api.put(`/account/saved-cards/${id}/default`);
      toast.success("Varsayılan kart güncellendi");
      mutate("/account/saved-cards");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setActioningId(null);
    }
  }

  async function handleDelete(id: number) {
    setActioningId(id);
    try {
      await api.delete(`/account/saved-cards/${id}`);
      toast.success("Kart başarıyla silindi");
      mutate("/account/saved-cards");
    } catch {
      toast.error("Kart silinirken bir hata oluştu");
    } finally {
      setActioningId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          Kartlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Kayıtlı Kartlarım</h1>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <CreditCard className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            Kayıtlı kartınız yok.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Kartlarınız ödeme sırasında kaydedilir.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cards.map((card) => (
              <Card key={card.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CreditCard className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {getCardBrandDisplay(card.card_brand)} **** ****
                        **** {card.last_four}
                      </span>
                      {card.is_default && (
                        <Badge className="rounded-md border-0 bg-[rgba(255,107,44,0.12)] text-xs text-[#ff6b2c]">
                          Varsayılan
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {card.card_label}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!card.is_default && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleSetDefault(card.id)}
                        disabled={actioningId === card.id}
                        title="Varsayılan Yap"
                      >
                        <Star className="size-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={actioningId === card.id}
                          />
                        }
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Kartı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu kartı silmek istediğinize emin misiniz?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(card.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Kartlarınız ödeme sırasında kaydedilir.
          </p>
        </>
      )}
    </div>
  );
}
