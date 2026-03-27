"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { formatPrice } from "@/lib/utils";
import {
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
  REFUND_REASON_LABELS,
} from "@/lib/constants";
import type { RefundRequest } from "@/types/order";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

interface AdminRefundDetail extends RefundRequest {
  user?: { id: number; name: string; email: string };
}

export function RefundDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const { data, isLoading, error, mutate } = useApi<AdminRefundDetail>(
    `/admin/refunds/${params.id}`,
  );

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    setProcessing(true);
    try {
      await api.put(`/admin/refunds/${params.id}/status`, {
        status: newStatus,
        admin_notes: adminNotes || undefined,
      });
      toast.success(
        newStatus === "approved"
          ? "İade talebi onaylandı."
          : "İade talebi reddedildi.",
      );
      mutate();
    } catch {
      toast.error("İşlem sırasında bir hata oluştu.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">İade talebi bulunamadı.</p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/iadeler")}
        >
          Geri Dön
        </Button>
      </div>
    );
  }

  const refund = data.data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/iadeler")}
          >
            <ArrowLeft className="mr-1 size-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold">İade Talebi</h1>
        </div>
        <Badge className={REFUND_STATUS_COLORS[refund.status] ?? ""}>
          {refund.status_label ??
            REFUND_STATUS_LABELS[refund.status] ??
            refund.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Refund Info */}
        <Card>
          <CardHeader>
            <CardTitle>İade Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Sebep</dt>
                <dd className="font-medium">
                  {refund.reason_label ??
                    REFUND_REASON_LABELS[refund.reason] ??
                    refund.reason}
                </dd>
              </div>
              {refund.description && (
                <div>
                  <dt className="text-sm text-muted-foreground">Açıklama</dt>
                  <dd className="text-sm">{refund.description}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted-foreground">İade Tutarı</dt>
                <dd className="text-lg font-bold text-emerald-600">
                  {formatPrice(refund.refund_amount)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Durum</dt>
                <dd>
                  <Badge
                    className={REFUND_STATUS_COLORS[refund.status] ?? ""}
                  >
                    {refund.status_label ??
                      REFUND_STATUS_LABELS[refund.status] ??
                      refund.status}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Talep Tarihi</dt>
                <dd className="text-sm">
                  {new Date(refund.created_at).toLocaleString("tr-TR")}
                </dd>
              </div>
              {refund.resolved_at && (
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Sonuçlanma Tarihi
                  </dt>
                  <dd className="text-sm">
                    {new Date(refund.resolved_at).toLocaleString("tr-TR")}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Order & Customer Info */}
        <div className="space-y-6">
          {/* Order */}
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              {refund.order ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Sipariş No
                    </dt>
                    <dd>
                      <Link
                        href={`/admin/siparisler/${refund.order_id}`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        #{refund.order.order_number}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Sipariş Tutarı
                    </dt>
                    <dd className="font-medium">
                      {formatPrice(refund.order.total)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Sipariş Tarihi
                    </dt>
                    <dd className="text-sm">
                      {new Date(refund.order.created_at).toLocaleDateString(
                        "tr-TR",
                      )}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sipariş bilgisi bulunamadı.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri</CardTitle>
            </CardHeader>
            <CardContent>
              {refund.user ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Ad Soyad</dt>
                    <dd>
                      <Link
                        href={`/admin/musteriler/${refund.user.id}`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        {refund.user.name}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">E-posta</dt>
                    <dd className="text-sm">{refund.user.email}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Müşteri bilgisi bulunamadı.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions or Resolved Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {refund.status === "pending"
                ? "Admin İşlemleri"
                : "Admin Notu"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {refund.status === "pending" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-notes"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Admin Notu
                  </label>
                  <Textarea
                    id="admin-notes"
                    placeholder="İade talebiyle ilgili notunuzu yazın..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={processing}
                        />
                      }
                    >
                      <CheckCircle className="mr-1 size-4" />
                      Onayla
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>İade Talebini Onayla</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu iade talebini onaylamak istediğinize emin misiniz?
                          {formatPrice(refund.refund_amount)} tutarında iade
                          yapılacaktır.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleStatusUpdate("approved")}
                        >
                          Onayla
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="destructive" disabled={processing} />
                      }
                    >
                      <XCircle className="mr-1 size-4" />
                      Reddet
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>İade Talebini Reddet</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu iade talebini reddetmek istediğinize emin misiniz?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleStatusUpdate("rejected")}
                        >
                          Reddet
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {refund.admin_notes ? (
                  <p className="text-sm">{refund.admin_notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Admin notu bulunmuyor.
                  </p>
                )}
                {refund.resolved_at && (
                  <p className="text-xs text-muted-foreground">
                    Sonuçlanma:{" "}
                    {new Date(refund.resolved_at).toLocaleString("tr-TR")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
