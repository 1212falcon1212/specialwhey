<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\CategoryResource;
use App\Services\Storefront\StorefrontCategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontCategoryService $categoryService
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAll();

        return $this->success(CategoryResource::collection($categories));
    }

    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->findBySlug($slug);

        return $this->success(new CategoryResource($category));
    }
}
