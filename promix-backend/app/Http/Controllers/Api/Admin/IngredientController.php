<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreIngredientRequest;
use App\Http\Requests\Admin\UpdateIngredientRequest;
use App\Http\Resources\Admin\IngredientResource;
use App\Services\IngredientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly IngredientService $ingredientService
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

    public function store(StoreIngredientRequest $request): JsonResponse
    {
        $ingredient = $this->ingredientService->create($request->validated());

        return $this->created(
            new IngredientResource($ingredient),
            'Bileşen başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $ingredient = $this->ingredientService->findOrFail($id);

        return $this->success(new IngredientResource($ingredient));
    }

    public function update(UpdateIngredientRequest $request, int $id): JsonResponse
    {
        $ingredient = $this->ingredientService->update($id, $request->validated());

        return $this->success(
            new IngredientResource($ingredient),
            'Bileşen başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->ingredientService->delete($id);

        return $this->deleted('Bileşen başarıyla silindi.');
    }
}
