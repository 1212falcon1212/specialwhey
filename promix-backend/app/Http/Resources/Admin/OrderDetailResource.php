<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;

class OrderDetailResource extends OrderResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'type' => $item->type->value,
                'ingredient' => $item->ingredient ? [
                    'id' => $item->ingredient->id,
                    'name' => $item->ingredient->name,
                    'slug' => $item->ingredient->slug,
                ] : null,
                'ingredient_option_id' => $item->ingredient_option_id,
                'mixer_snapshot' => $item->mixer_snapshot,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
            ])),
            'billing_address' => $this->whenLoaded('billingAddress'),
            'shipping_address' => $this->whenLoaded('shippingAddress'),
            'payments' => $this->whenLoaded('payments', fn () => $this->payments->map(fn ($payment) => [
                'id' => $payment->id,
                'payment_method' => $payment->payment_method,
                'transaction_id' => $payment->transaction_id,
                'amount' => (float) $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status->value,
                'paid_at' => $payment->paid_at?->toISOString(),
            ])),
            'refund_requests' => $this->whenLoaded('refundRequests', fn () => $this->refundRequests->map(fn ($refund) => [
                'id' => $refund->id,
                'reason' => $refund->reason->value,
                'status' => $refund->status->value,
                'refund_amount' => (float) $refund->refund_amount,
                'admin_notes' => $refund->admin_notes,
                'created_at' => $refund->created_at?->toISOString(),
            ])),
            'notes' => $this->notes,
            'admin_notes' => $this->admin_notes,
        ]);
    }
}
