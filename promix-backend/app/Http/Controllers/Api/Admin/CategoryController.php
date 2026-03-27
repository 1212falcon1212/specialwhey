<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\Admin\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getAll($request->all());

        return $this->successWithMeta(
            CategoryResource::collection($categories),
            [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ]
        );
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return $this->created(
            new CategoryResource($category),
            'Kategori başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->findOrFail($id);

        return $this->success(new CategoryResource($category));
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated());

        return $this->success(
            new CategoryResource($category),
            'Kategori başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->categoryService->delete($id);

        return $this->deleted('Kategori başarıyla silindi.');
    }
}
