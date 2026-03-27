"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  REFUND_STATUS_LABELS,
  REFUND_STATUS_COLORS,
} from "@/lib/constants";

interface RefundStatusBadgeProps {
  status: string;
}

export function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-md border-0 text-xs font-medium",
        REFUND_STATUS_COLORS[status] ?? "bg-[#f5f5f3] text-[#555555]"
      )}
    >
      {REFUND_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
