<?php

namespace App\Repositories\Storefront;

use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class StorefrontIngredientRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Ingredient::active()->with('category', 'options');

        if (isset($filters['category_slug'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category_slug']);
            });
        }

        if (isset($filters['min_price'])) {
            $query->where('base_price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('base_price', '<=', $filters['max_price']);
        }

        $sortBy = $filters['sort_by'] ?? 'sort_order';
        $allowedSorts = ['name', 'base_price', 'created_at', 'sort_order'];
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'sort_order';
        }

        $sortDir = $filters['sort_dir'] ?? 'asc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findBySlug(string $slug): Ingredient
    {
        return Ingredient::active()
            ->where('slug', $slug)
            ->with('category', 'options')
            ->firstOrFail();
    }

    public function getFeatured(int $limit = 8): Collection
    {
        return Ingredient::active()
            ->featured()
            ->with('category', 'options')
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
    }
}
