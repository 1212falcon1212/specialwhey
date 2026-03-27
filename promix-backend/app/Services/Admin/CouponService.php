<?php

namespace App\Services\Admin;

use App\Models\Coupon;
use App\Repositories\Admin\CouponRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CouponService
{
    public function __construct(
        private readonly CouponRepository $couponRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->couponRepository->paginate($filters);
    }

    public function findOrFail(int $id): Coupon
    {
        return $this->couponRepository->findOrFail($id);
    }

    public function create(array $data): Coupon
    {
        $data['code'] = strtoupper($data['code']);

        return $this->couponRepository->create($data);
    }

    public function update(int $id, array $data): Coupon
    {
        $coupon = $this->couponRepository->findOrFail($id);

        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }

        $this->couponRepository->update($coupon, $data);

        return $coupon->fresh();
    }

    public function delete(int $id): void
    {
        $coupon = $this->couponRepository->findOrFail($id);
        $this->couponRepository->delete($coupon);
    }
}
