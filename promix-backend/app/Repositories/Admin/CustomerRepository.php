<?php

namespace App\Repositories\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::customer()
            ->withCount('orders');

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findOrFail(int $id): User
    {
        return User::customer()
            ->withCount('orders')
            ->with(['addresses', 'orders' => function ($q) {
                $q->latest()->limit(10);
            }])
            ->findOrFail($id);
    }
}
