<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Http\Resources\Admin\PageResource;
use App\Services\Admin\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PageService $pageService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $pages = $this->pageService->getAll($request->all());

        return $this->successWithMeta(
            PageResource::collection($pages),
            [
                'current_page' => $pages->currentPage(),
                'last_page' => $pages->lastPage(),
                'per_page' => $pages->perPage(),
                'total' => $pages->total(),
            ]
        );
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $page = $this->pageService->create($request->validated());

        return $this->created(
            new PageResource($page),
            'Sayfa başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $page = $this->pageService->findOrFail($id);

        return $this->success(new PageResource($page));
    }

    public function update(UpdatePageRequest $request, int $id): JsonResponse
    {
        $page = $this->pageService->update($id, $request->validated());

        return $this->success(
            new PageResource($page),
            'Sayfa başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->pageService->delete($id);

        return $this->deleted('Sayfa başarıyla silindi.');
    }
}
