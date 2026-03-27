<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\StoreSavedCardRequest;
use App\Http\Resources\Storefront\SavedCardResource;
use App\Services\SavedCardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedCardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SavedCardService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $cards = $this->service->getAll($request->user());

        return $this->success(SavedCardResource::collection($cards), 'Kayıtlı kartlar listelendi.');
    }

    public function store(StoreSavedCardRequest $request): JsonResponse
    {
        $card = $this->service->create($request->user(), $request->validated());

        return $this->created(new SavedCardResource($card), 'Kart başarıyla kaydedildi.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $request->user());

        return $this->deleted('Kart başarıyla silindi.');
    }

    public function setDefault(Request $request, int $id): JsonResponse
    {
        $card = $this->service->setDefault($id, $request->user());

        return $this->success(new SavedCardResource($card), 'Varsayılan kart güncellendi.');
    }
}
