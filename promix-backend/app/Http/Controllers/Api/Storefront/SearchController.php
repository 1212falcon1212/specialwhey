<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\IngredientResource;
use App\Services\Storefront\StorefrontSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontSearchService $searchService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ], [
            'q.required' => 'Arama terimi zorunludur.',
            'q.min' => 'Arama terimi en az 2 karakter olmalıdır.',
        ]);

        $results = $this->searchService->search($request->q);

        return $this->successWithMeta(
            IngredientResource::collection($results),
            [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
            ]
        );
    }
}
