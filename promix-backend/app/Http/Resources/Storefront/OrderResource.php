<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_method' => $this->payment_method->value,
            'payment_method_label' => $this->payment_method->label(),
            'payment_status' => $this->payment_status->value,
            'payment_status_label' => $this->payment_status->label(),
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total,
            'currency' => $this->currency,
            'notes' => $this->notes,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'type' => $item->type->value,
                'type_label' => $item->type->label(),
                'ingredient_id' => $item->ingredient_id,
                'ingredient_name' => $item->ingredient?->name,
                'ingredient_option_id' => $item->ingredient_option_id,
                'option_label' => $item->option?->label,
                'mixer_snapshot' => $item->mixer_snapshot,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
            ])),
            'billing_address' => $this->whenLoaded('billingAddress', fn () => $this->formatAddress($this->billingAddress)),
            'shipping_address' => $this->whenLoaded('shippingAddress', fn () => $this->formatAddress($this->shippingAddress)),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }

    private function formatAddress($address): ?array
    {
        if (! $address) {
            return null;
        }

        return [
            'full_name' => $address->full_name,
            'phone' => $address->phone,
            'city' => $address->city,
            'district' => $address->district,
            'address_line' => $address->address_line,
            'zip_code' => $address->zip_code,
        ];
    }
}
