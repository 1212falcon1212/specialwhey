<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\OrderResource;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CheckoutService $checkoutService
    ) {}

    public function store(CheckoutRequest $request): JsonResponse
    {
        $order = $this->checkoutService->createOrder(
            $request->validated(),
            $request->user()
        );

        $paymentData = $this->checkoutService->initiatePayment(
            $order,
            $request->ip()
        );

        return $this->created([
            'order' => new OrderResource($order),
            'payment' => $paymentData,
        ], 'Sipariş oluşturuldu.');
    }
}
