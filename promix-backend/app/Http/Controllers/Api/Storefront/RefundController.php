<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\StoreRefundRequest;
use App\Http\Resources\Storefront\RefundRequestResource;
use App\Services\RefundService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RefundService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $refunds = $this->service->getByUser($request->user(), $request->query());

        return $this->successWithMeta(
            RefundRequestResource::collection($refunds),
            [
                'current_page' => $refunds->currentPage(),
                'last_page' => $refunds->lastPage(),
                'per_page' => $refunds->perPage(),
                'total' => $refunds->total(),
            ]
        );
    }

    public function store(StoreRefundRequest $request): JsonResponse
    {
        $refund = $this->service->create($request->user(), $request->validated());
        $refund->load('order');

        return $this->created(new RefundRequestResource($refund), 'İade talebi başarıyla oluşturuldu.');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $refund = $this->service->show($id, $request->user());

        return $this->success(new RefundRequestResource($refund), 'İade talebi detayı getirildi.');
    }
}
