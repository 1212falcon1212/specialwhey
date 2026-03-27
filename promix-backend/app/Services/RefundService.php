<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\RefundStatus;
use App\Models\Order;
use App\Models\RefundRequest;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RefundService
{
    public function getByUser(User $user, array $filters): LengthAwarePaginator
    {
        return RefundRequest::with('order')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function create(User $user, array $data): RefundRequest
    {
        $order = Order::findOrFail($data['order_id']);

        if ($order->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu siparişe erişim yetkiniz yok.');
        }

        if (! in_array($order->status, [OrderStatus::Delivered, OrderStatus::Shipped])) {
            throw new BadRequestHttpException('Sadece teslim edilmiş veya kargodaki siparişler için iade talebi oluşturabilirsiniz.');
        }

        $existingRefund = RefundRequest::where('order_id', $order->id)
            ->where('status', RefundStatus::Pending)
            ->exists();

        if ($existingRefund) {
            throw new BadRequestHttpException('Bu sipariş için zaten bekleyen bir iade talebi bulunmaktadır.');
        }

        return RefundRequest::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'reason' => $data['reason'],
            'description' => $data['description'] ?? null,
            'status' => RefundStatus::Pending,
            'refund_amount' => $order->total,
        ]);
    }

    public function show(int $id, User $user): RefundRequest
    {
        $refund = RefundRequest::with('order')->findOrFail($id);

        if ($refund->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu iade talebine erişim yetkiniz yok.');
        }

        return $refund;
    }
}
