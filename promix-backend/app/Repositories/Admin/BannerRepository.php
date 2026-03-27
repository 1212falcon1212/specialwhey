<?php

namespace App\Repositories\Admin;

use App\Models\Banner;
use Illuminate\Pagination\LengthAwarePaginator;

class BannerRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Banner::query();

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        $query->orderBy('sort_order', 'asc');

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findOrFail(int $id): Banner
    {
        return Banner::findOrFail($id);
    }

    public function create(array $data): Banner
    {
        return Banner::create($data);
    }

    public function update(Banner $banner, array $data): Banner
    {
        $banner->update($data);

        return $banner;
    }

    public function delete(Banner $banner): void
    {
        $banner->delete();
    }
}
