"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "sort_order", label: "Varsayılan" },
  { value: "name-asc", label: "A-Z" },
  { value: "name-desc", label: "Z-A" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "created_at-desc", label: "En Yeni" },
] as const;

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
  return (
    <Select value={value} onValueChange={(val) => { if (val !== null) onChange(val); }}>
      <SelectTrigger className="w-full sm:w-[220px]">
        <SelectValue placeholder="Sıralama" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
