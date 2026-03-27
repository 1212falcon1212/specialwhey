<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Http\Requests\Admin\UpdateCouponRequest;
use App\Http\Resources\Admin\CouponResource;
use App\Services\Admin\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CouponService $couponService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $coupons = $this->couponService->getAll($request->all());

        return $this->successWithMeta(
            CouponResource::collection($coupons),
            [
                'current_page' => $coupons->currentPage(),
                'last_page' => $coupons->lastPage(),
                'per_page' => $coupons->perPage(),
                'total' => $coupons->total(),
            ]
        );
    }

    public function store(StoreCouponRequest $request): JsonResponse
    {
        $coupon = $this->couponService->create($request->validated());

        return $this->created(
            new CouponResource($coupon),
            'Kupon başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $coupon = $this->couponService->findOrFail($id);

        return $this->success(new CouponResource($coupon));
    }

    public function update(UpdateCouponRequest $request, int $id): JsonResponse
    {
        $coupon = $this->couponService->update($id, $request->validated());

        return $this->success(
            new CouponResource($coupon),
            'Kupon başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->couponService->delete($id);

        return $this->deleted('Kupon başarıyla silindi.');
    }
}
