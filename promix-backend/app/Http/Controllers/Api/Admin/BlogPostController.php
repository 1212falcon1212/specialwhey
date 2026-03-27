<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Http\Resources\Admin\BlogPostResource;
use App\Services\Admin\BlogPostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly BlogPostService $blogPostService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['is_published']);
        $posts = $this->blogPostService->getAll($filters);

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

    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['author_id'] = $request->user()->id;
        $post = $this->blogPostService->create($data);

        return $this->created(new BlogPostResource($post->load('author:id,name')), 'Blog yazısı oluşturuldu.');
    }

    public function show(int $id): JsonResponse
    {
        $post = $this->blogPostService->findOrFail($id);

        return $this->success(new BlogPostResource($post));
    }

    public function update(UpdateBlogPostRequest $request, int $id): JsonResponse
    {
        $post = $this->blogPostService->update($id, $request->validated());

        return $this->success(new BlogPostResource($post), 'Blog yazısı güncellendi.');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->blogPostService->delete($id);

        return $this->deleted('Blog yazısı silindi.');
    }
}
