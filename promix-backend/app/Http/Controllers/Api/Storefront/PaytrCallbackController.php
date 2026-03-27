<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PaytrCallbackController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService
    ) {}

    public function handle(Request $request): Response
    {
        try {
            $this->checkoutService->handlePaymentCallback($request->post());
        } catch (\Throwable $e) {
            Log::error('PayTR callback error', [
                'error' => $e->getMessage(),
                'data' => $request->post(),
            ]);

            return response('FAIL', 400);
        }

        return response('OK');
    }
}
