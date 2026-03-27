"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { REFUND_REASON_LABELS } from "@/lib/constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const refundSchema = z.object({
  reason: z.string().min(1, "Lütfen bir iade sebebi seçiniz"),
  description: z.string().max(1000, "Açıklama en fazla 1000 karakter olabilir"),
});

type RefundFormValues = z.infer<typeof refundSchema>;

interface RefundRequestDialogProps {
  orderId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RefundRequestDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: RefundRequestDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      reason: "",
      description: "",
    },
  });

  async function onSubmit(data: RefundFormValues) {
    try {
      await api.post("/account/refunds", {
        order_id: orderId,
        reason: data.reason,
        description: data.description || null,
      });
      toast.success("İade talebiniz oluşturuldu");
      onSuccess();
      onOpenChange(false);
      reset();
    } catch {
      toast.error("İade talebi oluşturulurken bir hata oluştu");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>İade Talebi Oluştur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Reason */}
          <div>
            <Label>İade Sebebi</Label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Sebep seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REFUND_REASON_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
            <Textarea
              id="description"
              placeholder="İade sebebinizi detaylı açıklayabilirsiniz..."
              rows={4}
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description?.message && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              "İade Talebi Gönder"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
