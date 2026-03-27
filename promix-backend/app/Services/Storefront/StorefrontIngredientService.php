<?php

namespace App\Services\Storefront;

use App\Models\Ingredient;
use App\Repositories\Storefront\StorefrontIngredientRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class StorefrontIngredientService
{
    public function __construct(
        private readonly StorefrontIngredientRepository $ingredientRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->ingredientRepository->paginate($filters);
    }

    public function findBySlug(string $slug): Ingredient
    {
        return Cache::remember("storefront:ingredients:slug:{$slug}", 1800, function () use ($slug) {
            return $this->ingredientRepository->findBySlug($slug);
        });
    }

    public function getFeatured(int $limit = 8): Collection
    {
        return Cache::remember("storefront:ingredients:featured:{$limit}", 1800, function () use ($limit) {
            return $this->ingredientRepository->getFeatured($limit);
        });
    }
}
