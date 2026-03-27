<?php

namespace App\Repositories\Storefront;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class StorefrontCategoryRepository
{
    public function getAll(): Collection
    {
        return Category::active()
            ->root()
            ->with('children')
            ->withCount('ingredients')
            ->orderBy('sort_order')
            ->get();
    }

    public function findBySlug(string $slug): Category
    {
        return Category::active()
            ->where('slug', $slug)
            ->with('children')
            ->withCount('ingredients')
            ->firstOrFail();
    }
}
