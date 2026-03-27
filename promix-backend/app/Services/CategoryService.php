<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    use ClearsCacheKeys;

    public function __construct(
        private readonly CategoryRepository $categoryRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->categoryRepository->paginate($filters);
    }

    public function getAllFlat(array $filters = []): Collection
    {
        return $this->categoryRepository->all($filters);
    }

    public function findOrFail(int $id): Category
    {
        return $this->categoryRepository->findOrFail($id);
    }

    public function create(array $data): Category
    {
        $category = $this->categoryRepository->create($data);
        $this->clearCacheKeys(['storefront:categories:all']);

        return $category->load('parent');
    }

    public function update(int $id, array $data): Category
    {
        $category = $this->categoryRepository->findOrFail($id);
        $this->categoryRepository->update($category, $data);
        $this->clearCacheKeys(['storefront:categories:all', "storefront:categories:slug:{$category->slug}"]);

        return $category->fresh(['parent', 'children']);
    }

    public function delete(int $id): void
    {
        $category = $this->categoryRepository->findOrFail($id);
        $slug = $category->slug;

        // Alt kategorilerin parent_id'sini null yap
        Category::where('parent_id', $category->id)->update(['parent_id' => null]);

        $this->categoryRepository->delete($category);
        $this->clearCacheKeys(['storefront:categories:all', "storefront:categories:slug:{$slug}"]);
    }
}
