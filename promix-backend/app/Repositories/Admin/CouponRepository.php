<?php

namespace App\Repositories\Admin;

use App\Models\Coupon;
use Illuminate\Pagination\LengthAwarePaginator;

class CouponRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Coupon::query();

        if (isset($filters['search'])) {
            $query->where('code', 'like', "%{$filters['search']}%");
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findOrFail(int $id): Coupon
    {
        return Coupon::findOrFail($id);
    }

    public function create(array $data): Coupon
    {
        return Coupon::create($data);
    }

    public function update(Coupon $coupon, array $data): Coupon
    {
        $coupon->update($data);

        return $coupon;
    }

    public function delete(Coupon $coupon): void
    {
        $coupon->delete();
    }
}
