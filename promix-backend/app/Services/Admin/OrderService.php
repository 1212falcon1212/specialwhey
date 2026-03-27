<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Repositories\Admin\OrderRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderService
{
    public function __construct(
        private readonly OrderRepository $orderRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->orderRepository->paginate($filters);
    }

    public function findOrFail(int $id): Order
    {
        return $this->orderRepository->findOrFail($id);
    }

    public function updateStatus(int $id, string $status): Order
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $status]);

        return $order->fresh();
    }

    public function updatePaymentStatus(int $id, string $paymentStatus): Order
    {
        $order = Order::findOrFail($id);
        $order->update(['payment_status' => $paymentStatus]);

        // If payment confirmed, auto-update order status to paid
        if ($paymentStatus === 'success' && $order->status->value === 'pending') {
            $order->update(['status' => 'paid']);
        }

        return $order->fresh();
    }
}
