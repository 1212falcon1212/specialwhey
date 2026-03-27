<?php

namespace App\Services\Storefront;

use App\Repositories\Storefront\StorefrontBannerRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class StorefrontBannerService
{
    public function __construct(
        private readonly StorefrontBannerRepository $bannerRepository
    ) {}

    public function getActive(): Collection
    {
        return Cache::remember('storefront:banners:active', 3600, function () {
            return $this->bannerRepository->getActive();
        });
    }

    public function getByPosition(string $position): Collection
    {
        return Cache::remember("storefront:banners:position:{$position}", 3600, function () use ($position) {
            return $this->bannerRepository->getByPosition($position);
        });
    }
}
