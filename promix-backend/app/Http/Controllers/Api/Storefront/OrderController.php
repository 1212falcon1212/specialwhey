<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->service->getUserOrders($request->user(), $request->query());

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

    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $order = $this->service->getUserOrderDetail($orderNumber, $request->user());

        return $this->success(new OrderResource($order), 'Sipariş detayı getirildi.');
    }
}
