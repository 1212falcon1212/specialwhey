<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\FavoriteResource;
use App\Services\FavoriteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly FavoriteService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $favorites = $this->service->getAll($request->user(), $request->query());

        return $this->successWithMeta(
            FavoriteResource::collection($favorites),
            [
                'current_page' => $favorites->currentPage(),
                'last_page' => $favorites->lastPage(),
                'per_page' => $favorites->perPage(),
                'total' => $favorites->total(),
            ]
        );
    }

    public function toggle(Request $request, int $ingredientId): JsonResponse
    {
        $result = $this->service->toggle($request->user(), $ingredientId);

        $message = $result['action'] === 'added'
            ? 'Favorilere eklendi.'
            : 'Favorilerden kaldırıldı.';

        return $this->success($result, $message);
    }

    public function ids(Request $request): JsonResponse
    {
        $ids = $this->service->getIds($request->user());

        return $this->success($ids, 'Favori bileşen ID\'leri getirildi.');
    }
}
