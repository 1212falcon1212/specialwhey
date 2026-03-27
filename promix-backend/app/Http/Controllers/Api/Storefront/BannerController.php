<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\BannerResource;
use App\Services\Storefront\StorefrontBannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontBannerService $bannerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $position = $request->query('position');
        $banners = $position
            ? $this->bannerService->getByPosition($position)
            : $this->bannerService->getActive();

        return $this->success(BannerResource::collection($banners));
    }
}
