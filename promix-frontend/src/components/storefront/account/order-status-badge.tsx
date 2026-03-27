"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/constants";

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-md border-0 text-xs font-medium",
        ORDER_STATUS_COLORS[status] ?? "bg-[#f5f5f3] text-[#555555]"
      )}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
