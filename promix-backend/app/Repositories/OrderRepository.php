<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository
{
    public function paginateByUser(User $user, array $filters): LengthAwarePaginator
    {
        return Order::with('items', 'billingAddress')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function findByOrderNumber(string $orderNumber): Order
    {
        return Order::with('items.ingredient', 'items.option', 'billingAddress', 'shippingAddress', 'payments', 'refundRequests')
            ->where('order_number', $orderNumber)
            ->firstOrFail();
    }
}
