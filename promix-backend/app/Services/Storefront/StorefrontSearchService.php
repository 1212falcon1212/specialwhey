<?php

namespace App\Services\Storefront;

use App\Models\Ingredient;
use Illuminate\Pagination\LengthAwarePaginator;

class StorefrontSearchService
{
    /**
     * Search ingredients using Scout (Meilisearch) with LIKE fallback.
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        try {
            return Ingredient::search($query)
                ->where('is_active', true)
                ->paginate($perPage);
        } catch (\Exception $e) {
            return Ingredient::active()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%");
                })
                ->with('category', 'options')
                ->paginate($perPage);
        }
    }
}
