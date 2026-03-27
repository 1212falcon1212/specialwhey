<?php

namespace App\Services\Admin;

use App\Models\Page;
use App\Repositories\Admin\PageRepository;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Pagination\LengthAwarePaginator;

class PageService
{
    use ClearsCacheKeys;

    public function __construct(
        private readonly PageRepository $pageRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->pageRepository->paginate($filters);
    }

    public function findOrFail(int $id): Page
    {
        return $this->pageRepository->findOrFail($id);
    }

    public function create(array $data): Page
    {
        $page = $this->pageRepository->create($data);
        $this->clearCacheKeys(["storefront:pages:slug:{$page->slug}"]);

        return $page;
    }

    public function update(int $id, array $data): Page
    {
        $page = $this->pageRepository->findOrFail($id);
        $slug = $page->slug;
        $this->pageRepository->update($page, $data);
        $this->clearCacheKeys(["storefront:pages:slug:{$slug}"]);

        return $page->fresh();
    }

    public function delete(int $id): void
    {
        $page = $this->pageRepository->findOrFail($id);
        $slug = $page->slug;
        $this->pageRepository->delete($page);
        $this->clearCacheKeys(["storefront:pages:slug:{$slug}"]);
    }
}
