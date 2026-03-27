"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import type { OrderStatus, PaymentStatus } from "@/types/order";

interface OrderStatusUpdateProps {
  orderId: number;
  currentStatus: string;
  currentPaymentStatus: string;
  onUpdate: () => void;
}

export function OrderStatusUpdate({
  orderId,
  currentStatus,
  currentPaymentStatus,
  onUpdate,
}: OrderStatusUpdateProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [newPaymentStatus, setNewPaymentStatus] = useState(currentPaymentStatus);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const handleStatusUpdate = async () => {
    if (newStatus === currentStatus) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Sipariş durumu güncellendi.");
      onUpdate();
    } catch {
      toast.error("Durum güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (newPaymentStatus === currentPaymentStatus) return;
    setUpdatingPayment(true);
    try {
      await api.put(`/admin/orders/${orderId}/payment-status`, {
        payment_status: newPaymentStatus,
      });
      toast.success("Ödeme durumu güncellendi.");
      onUpdate();
    } catch {
      toast.error("Ödeme durumu güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingPayment(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Durum Güncelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Sipariş Durumu Güncelle</h4>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={newStatus}
              onValueChange={(val) => {
                if (val !== null) setNewStatus(val);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    size="sm"
                    disabled={
                      newStatus === currentStatus || updatingStatus
                    }
                  />
                }
              >
                {updatingStatus ? "Güncelleniyor..." : "Güncelle"}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Durumu Güncelle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sipariş durumunu &quot;
                    {ORDER_STATUS_LABELS[newStatus] ?? newStatus}&quot; olarak
                    güncellemek istediğinize emin misiniz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStatusUpdate}>
                    Onayla
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Payment Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Ödeme Durumu Güncelle</h4>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={newPaymentStatus}
              onValueChange={(val) => {
                if (val !== null) setNewPaymentStatus(val);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    size="sm"
                    disabled={
                      newPaymentStatus === currentPaymentStatus ||
                      updatingPayment
                    }
                  />
                }
              >
                {updatingPayment ? "Güncelleniyor..." : "Güncelle"}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ödeme Durumunu Güncelle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ödeme durumunu &quot;
                    {PAYMENT_STATUS_LABELS[newPaymentStatus] ??
                      newPaymentStatus}
                    &quot; olarak güncellemek istediğinize emin misiniz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePaymentStatusUpdate}>
                    Onayla
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
