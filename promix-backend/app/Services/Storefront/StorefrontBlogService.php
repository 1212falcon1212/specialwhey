<?php

namespace App\Services\Storefront;

use App\Models\BlogPost;
use App\Repositories\Storefront\StorefrontBlogRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class StorefrontBlogService
{
    public function __construct(
        private readonly StorefrontBlogRepository $blogRepository
    ) {}

    public function paginate(int $perPage = 12): LengthAwarePaginator
    {
        return $this->blogRepository->paginate($perPage);
    }

    public function findBySlug(string $slug): ?BlogPost
    {
        return $this->blogRepository->findBySlug($slug);
    }
}
