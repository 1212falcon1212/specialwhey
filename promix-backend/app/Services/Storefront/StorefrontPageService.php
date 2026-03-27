<?php

namespace App\Services\Storefront;

use App\Models\Page;
use App\Repositories\Storefront\StorefrontPageRepository;
use Illuminate\Support\Facades\Cache;

class StorefrontPageService
{
    public function __construct(
        private readonly StorefrontPageRepository $pageRepository
    ) {}

    public function findBySlug(string $slug): Page
    {
        return Cache::remember("storefront:pages:slug:{$slug}", 3600, function () use ($slug) {
            return $this->pageRepository->findBySlug($slug);
        });
    }
}
