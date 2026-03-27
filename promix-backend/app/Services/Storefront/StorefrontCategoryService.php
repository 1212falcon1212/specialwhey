<?php

namespace App\Services\Storefront;

use App\Models\Category;
use App\Repositories\Storefront\StorefrontCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class StorefrontCategoryService
{
    public function __construct(
        private readonly StorefrontCategoryRepository $categoryRepository
    ) {}

    public function getAll(): Collection
    {
        return Cache::remember('storefront:categories:all', 3600, function () {
            return $this->categoryRepository->getAll();
        });
    }

    public function findBySlug(string $slug): Category
    {
        return Cache::remember("storefront:categories:slug:{$slug}", 3600, function () use ($slug) {
            return $this->categoryRepository->findBySlug($slug);
        });
    }
}
