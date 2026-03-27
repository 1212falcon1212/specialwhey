<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Http\Requests\Admin\UpdateBannerRequest;
use App\Http\Resources\Admin\BannerResource;
use App\Services\Admin\BannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly BannerService $bannerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $banners = $this->bannerService->getAll($request->all());

        return $this->successWithMeta(
            BannerResource::collection($banners),
            [
                'current_page' => $banners->currentPage(),
                'last_page' => $banners->lastPage(),
                'per_page' => $banners->perPage(),
                'total' => $banners->total(),
            ]
        );
    }

    public function store(StoreBannerRequest $request): JsonResponse
    {
        $banner = $this->bannerService->create($request->validated());

        return $this->created(
            new BannerResource($banner),
            'Banner başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $banner = $this->bannerService->findOrFail($id);

        return $this->success(new BannerResource($banner));
    }

    public function update(UpdateBannerRequest $request, int $id): JsonResponse
    {
        $banner = $this->bannerService->update($id, $request->validated());

        return $this->success(
            new BannerResource($banner),
            'Banner başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->bannerService->delete($id);

        return $this->deleted('Banner başarıyla silindi.');
    }
}
