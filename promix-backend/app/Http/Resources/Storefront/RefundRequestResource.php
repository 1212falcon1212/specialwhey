<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefundRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order' => $this->whenLoaded('order', fn () => [
                'order_number' => $this->order->order_number,
                'total' => (float) $this->order->total,
                'created_at' => $this->order->created_at?->toISOString(),
            ]),
            'reason' => $this->reason->value,
            'reason_label' => $this->reason->label(),
            'description' => $this->description,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'refund_amount' => (float) $this->refund_amount,
            'admin_notes' => $this->admin_notes,
            'resolved_at' => $this->resolved_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
