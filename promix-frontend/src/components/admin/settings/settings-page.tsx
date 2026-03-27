"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
}

interface SettingsResponse {
  [group: string]: Setting[];
}

export function SettingsPage() {
  const { data, isLoading, mutate } = useApi<SettingsResponse>(
    "/admin/settings",
  );
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const settingsData = data?.data;

  useEffect(() => {
    if (settingsData) {
      const initial: Record<string, string> = {};
      Object.values(settingsData).forEach((groupSettings) => {
        groupSettings.forEach((setting) => {
          initial[setting.key] = setting.value;
        });
      });
      setValues(initial);
    }
  }, [settingsData]);

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/admin/settings", { settings: values });
      toast.success("Ayarlar kaydedildi.");
      mutate();
    } catch {
      toast.error("Ayarlar kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Ayarlar</h1>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!settingsData || Object.keys(settingsData).length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Ayarlar</h1>
        <div className="flex h-48 items-center justify-center rounded-md border text-muted-foreground">
          Henuz ayar tanimlanmamis.
        </div>
      </div>
    );
  }

  const groupLabels: Record<string, string> = {
    general: "Genel",
    contact: "İletişim",
    social: "Sosyal Medya",
    seo: "SEO",
    shipping: "Kargo",
    payment: "Ödeme",
    email: "E-posta",
    notification: "Bildirimler",
    storefront: "Site Ayarları",
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", "settings");
      const res = await api.post("/admin/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.url || res.data.url;
      updateValue(key, url);
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingKey(null);
    }
  };

  const renderField = (setting: Setting) => {
    const value = values[setting.key] ?? setting.value;

    if (setting.type === "image") {
      const isUploading = uploadingKey === setting.key;
      return (
        <div key={setting.key} className="space-y-2">
          <Label>{setting.label || setting.key}</Label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={(el) => { fileRefs.current[setting.key] = el; }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(setting.key, f);
              e.target.value = "";
            }}
          />
          {value ? (
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                <Image src={value} alt={setting.label || setting.key} fill className="object-contain" unoptimized />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileRefs.current[setting.key]?.click()}
                >
                  {isUploading ? <><Loader2 className="mr-1.5 size-4 animate-spin" />Yükleniyor</> : <><ImagePlus className="mr-1.5 size-4" />Değiştir</>}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => updateValue(setting.key, "")}
                >
                  <Trash2 className="mr-1.5 size-4" />Kaldır
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileRefs.current[setting.key]?.click()}
              className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
            >
              {isUploading ? (
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" />Yükleniyor...</span>
              ) : (
                <span className="flex flex-col items-center gap-1 text-muted-foreground"><ImagePlus className="size-6" /><span className="text-xs">Görsel yükle</span></span>
              )}
            </button>
          )}
        </div>
      );
    }

    if (setting.type === "boolean") {
      return (
        <div key={setting.key} className="flex items-center gap-2">
          <Switch
            checked={value === "1" || value === "true"}
            onCheckedChange={(checked) =>
              updateValue(setting.key, checked ? "1" : "0")
            }
          />
          <Label>{setting.label || setting.key}</Label>
        </div>
      );
    }

    if (setting.type === "textarea") {
      return (
        <div key={setting.key} className="space-y-2">
          <Label>{setting.label || setting.key}</Label>
          <Textarea
            value={value}
            onChange={(e) => updateValue(setting.key, e.target.value)}
            rows={4}
          />
        </div>
      );
    }

    return (
      <div key={setting.key} className="space-y-2">
        <Label>{setting.label || setting.key}</Label>
        <Input
          value={value}
          onChange={(e) => updateValue(setting.key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Ayarlar</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(settingsData).map(([group, settings]) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>
                {groupLabels[group] || group}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.map((setting) => renderField(setting))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
