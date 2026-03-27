<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Repositories\IngredientRepository;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Pagination\LengthAwarePaginator;

class IngredientService
{
    use ClearsCacheKeys;

    public function __construct(
        private readonly IngredientRepository $ingredientRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->ingredientRepository->paginate($filters);
    }

    public function findOrFail(int $id): Ingredient
    {
        return $this->ingredientRepository->findOrFail($id);
    }

    public function create(array $data): Ingredient
    {
        $options = $data['options'] ?? [];
        unset($data['options']);

        $ingredient = $this->ingredientRepository->create($data);

        if (! empty($options)) {
            foreach ($options as $index => $option) {
                $option['sort_order'] = $option['sort_order'] ?? $index;
                $ingredient->options()->create($option);
            }
        }

        $this->clearCacheKeys(['storefront:ingredients:featured:8', "storefront:ingredients:slug:{$ingredient->slug}"]);

        return $ingredient->load('options', 'category');
    }

    public function update(int $id, array $data): Ingredient
    {
        $ingredient = $this->ingredientRepository->findOrFail($id);

        $options = $data['options'] ?? null;
        unset($data['options']);

        $this->ingredientRepository->update($ingredient, $data);

        if ($options !== null) {
            // Mevcut option'ları sil ve yeniden oluştur
            $ingredient->options()->delete();
            foreach ($options as $index => $option) {
                $option['sort_order'] = $option['sort_order'] ?? $index;
                $ingredient->options()->create($option);
            }
        }

        $this->clearCacheKeys(['storefront:ingredients:featured:8', "storefront:ingredients:slug:{$ingredient->slug}"]);

        return $ingredient->fresh(['options', 'category']);
    }

    public function delete(int $id): void
    {
        $ingredient = $this->ingredientRepository->findOrFail($id);
        $slug = $ingredient->slug;
        $this->ingredientRepository->delete($ingredient);
        $this->clearCacheKeys(['storefront:ingredients:featured:8', "storefront:ingredients:slug:{$slug}"]);
    }
}
