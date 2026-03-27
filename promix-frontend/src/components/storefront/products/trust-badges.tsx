"use client";

import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import type { TrustBadge } from "@/types/settings";

const iconMap: Record<string, LucideIcon> = {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
};

const defaultBadges: TrustBadge[] = [
  { icon: "Truck", text: "Ücretsiz Kargo" },
  { icon: "ShieldCheck", text: "Güvenli Ödeme" },
  { icon: "RefreshCw", text: "Kolay İade" },
  { icon: "Headphones", text: "7/24 Destek" },
];

function parseBadges(raw: unknown): TrustBadge[] {
  if (!raw) return defaultBadges;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
  }
  return defaultBadges;
}

export function TrustBadges() {
  const { settings } = useSettings();
  const badges = parseBadges(settings?.["storefront.trust_badges"]);

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-[rgba(255,107,44,0.1)] bg-[#f5f5f3] p-4">
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon];
        return (
          <div key={badge.text} className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-[#ff6b2c]" />}
            <span className="text-xs font-medium text-muted-foreground">
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
