<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\IngredientDetailResource;
use App\Http\Resources\Storefront\IngredientResource;
use App\Services\Storefront\StorefrontIngredientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontIngredientService $ingredientService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $ingredients = $this->ingredientService->getAll($request->all());

        return $this->successWithMeta(
            IngredientResource::collection($ingredients),
            [
                'current_page' => $ingredients->currentPage(),
                'last_page' => $ingredients->lastPage(),
                'per_page' => $ingredients->perPage(),
                'total' => $ingredients->total(),
            ]
        );
    }

    public function show(string $slug): JsonResponse
    {
        $ingredient = $this->ingredientService->findBySlug($slug);

        return $this->success(new IngredientDetailResource($ingredient));
    }

    public function featured(): JsonResponse
    {
        $ingredients = $this->ingredientService->getFeatured();

        return $this->success(IngredientResource::collection($ingredients));
    }
}
