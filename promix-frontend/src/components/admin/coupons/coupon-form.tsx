"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CouponData {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

interface CouponFormProps {
  couponId?: string;
  initialData?: CouponData;
}

export function CouponForm({ couponId, initialData }: CouponFormProps) {
  const router = useRouter();
  const isEditing = !!couponId;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: initialData?.code || "",
    type: initialData?.type || "percentage",
    value: initialData?.value || 0,
    min_order_amount: initialData?.min_order_amount || "",
    usage_limit: initialData?.usage_limit || "",
    starts_at: initialData?.starts_at
      ? initialData.starts_at.split("T")[0]
      : "",
    expires_at: initialData?.expires_at
      ? initialData.expires_at.split("T")[0]
      : "",
    is_active: initialData?.is_active ?? true,
  });

  const updateField = (
    key: string,
    value: string | number | boolean,
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order_amount: form.min_order_amount
        ? Number(form.min_order_amount)
        : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      starts_at: form.starts_at || null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/coupons/${couponId}`, payload);
        toast.success("Kupon guncellendi.");
      } else {
        await api.post("/admin/coupons", payload);
        toast.success("Kupon olusturuldu.");
      }
      router.push("/admin/kuponlar");
    } catch {
      toast.error("Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kupon Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Kupon Kodu</Label>
              <Input
                value={form.code}
                onChange={(e) =>
                  updateField("code", e.target.value.toUpperCase())
                }
                placeholder="INDIRIM20"
                className="uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Indirim Turu</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  v !== null && updateField("type", v)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Yuzde (%)</SelectItem>
                  <SelectItem value="fixed">Sabit (TL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Deger {form.type === "percentage" ? "(%)" : "(TL)"}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.value}
                onChange={(e) =>
                  updateField("value", Number(e.target.value))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Min. Siparis Tutari (TL)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.min_order_amount}
                onChange={(e) =>
                  updateField("min_order_amount", e.target.value)
                }
                placeholder="Opsiyonel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kullanim Limiti</Label>
            <Input
              type="number"
              min="0"
              value={form.usage_limit}
              onChange={(e) =>
                updateField("usage_limit", e.target.value)
              }
              placeholder="Sinirsiz"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarih & Durum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Baslangic Tarihi</Label>
              <Input
                type="date"
                value={form.starts_at}
                onChange={(e) =>
                  updateField("starts_at", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bitis Tarihi</Label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={(e) =>
                  updateField("expires_at", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) =>
                updateField("is_active", checked)
              }
            />
            <Label>Aktif</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/kuponlar")}
        >
          Iptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Kaydediliyor..."
            : isEditing
              ? "Guncelle"
              : "Olustur"}
        </Button>
      </div>
    </form>
  );
}
