<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Requests\Admin\UpdatePaymentStatusRequest;
use App\Http\Resources\Admin\OrderDetailResource;
use App\Http\Resources\Admin\OrderResource;
use App\Services\Admin\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $orderService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getAll($request->all());

        return $this->successWithMeta(
            OrderResource::collection($orders),
            [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->findOrFail($id);

        return $this->success(new OrderDetailResource($order));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        $order = $this->orderService->updateStatus($id, $request->validated('status'));

        return $this->success(
            new OrderDetailResource($order->load([
                'user',
                'items.ingredient',
                'billingAddress',
                'shippingAddress',
                'payments',
                'refundRequests',
            ])),
            'Sipariş durumu başarıyla güncellendi.'
        );
    }

    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, int $id): JsonResponse
    {
        $order = $this->orderService->updatePaymentStatus($id, $request->validated('payment_status'));

        return $this->success(
            new OrderDetailResource($order->load([
                'user',
                'items.ingredient',
                'billingAddress',
                'shippingAddress',
                'payments',
                'refundRequests',
            ])),
            'Ödeme durumu başarıyla güncellendi.'
        );
    }
}
