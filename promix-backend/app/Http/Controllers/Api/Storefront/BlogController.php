<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Storefront\BlogPostResource;
use App\Services\Storefront\StorefrontBlogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontBlogService $blogService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 12);
        $posts = $this->blogService->paginate($perPage);

        return $this->successWithMeta(
            BlogPostResource::collection($posts),
            [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ]
        );
    }

    public function show(string $slug): JsonResponse
    {
        $post = $this->blogService->findBySlug($slug);

        if (! $post) {
            return $this->notFound('Blog yazısı bulunamadı.');
        }

        return $this->success(new BlogPostResource($post));
    }
}
