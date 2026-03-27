<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Repositories\OrderRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class OrderService
{
    public function __construct(
        private readonly OrderRepository $repository
    ) {}

    public function getUserOrders(User $user, array $filters): LengthAwarePaginator
    {
        return $this->repository->paginateByUser($user, $filters);
    }

    public function getUserOrderDetail(string $orderNumber, User $user): Order
    {
        $order = $this->repository->findByOrderNumber($orderNumber);

        if ($order->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu siparişe erişim yetkiniz yok.');
        }

        return $order;
    }
}
