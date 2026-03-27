<?php

namespace App\Http\Resources\Admin;

use App\Services\Admin\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $customerService = app(CustomerService::class);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->value,
            'orders_count' => $this->whenCounted('orders'),
            'total_spent' => $customerService->getTotalSpent($this->resource),
            'addresses' => $this->whenLoaded('addresses', fn () => $this->addresses->map(fn ($address) => [
                'id' => $address->id,
                'title' => $address->title,
                'full_name' => $address->full_name,
                'phone' => $address->phone,
                'city' => $address->city,
                'district' => $address->district,
                'address' => $address->address,
                'postal_code' => $address->postal_code,
                'is_default' => $address->is_default,
            ])),
            'recent_orders' => $this->whenLoaded('orders', fn () => $this->orders->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'total' => (float) $order->total,
                'created_at' => $order->created_at?->toISOString(),
            ])),
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
