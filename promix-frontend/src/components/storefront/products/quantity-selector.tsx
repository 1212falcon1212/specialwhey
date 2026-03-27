"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg border">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 rounded-r-none"
        onClick={handleDecrease}
        disabled={value <= min}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="h-10 w-14 rounded-none border-x border-y-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={min}
        max={max}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 rounded-l-none"
        onClick={handleIncrease}
        disabled={value >= max}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
