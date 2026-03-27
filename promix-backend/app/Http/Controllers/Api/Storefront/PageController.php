<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\PageResource;
use App\Services\Storefront\StorefrontPageService;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontPageService $pageService
    ) {}

    public function show(string $slug): JsonResponse
    {
        $page = $this->pageService->findBySlug($slug);

        return $this->success(new PageResource($page));
    }
}
