<?php

namespace App\Services\Admin;

use App\Models\Banner;
use App\Repositories\Admin\BannerRepository;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Pagination\LengthAwarePaginator;

class BannerService
{
    use ClearsCacheKeys;

    public function __construct(
        private readonly BannerRepository $bannerRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->bannerRepository->paginate($filters);
    }

    public function findOrFail(int $id): Banner
    {
        return $this->bannerRepository->findOrFail($id);
    }

    public function create(array $data): Banner
    {
        $banner = $this->bannerRepository->create($data);
        $this->clearCacheKeys([
            'storefront:banners:active',
            'storefront:banners:position:hero',
            'storefront:banners:position:sidebar',
            'storefront:banners:position:category_promo',
            'storefront:banners:position:fullwidth_promo',
        ]);

        return $banner;
    }

    public function update(int $id, array $data): Banner
    {
        $banner = $this->bannerRepository->findOrFail($id);
        $this->bannerRepository->update($banner, $data);
        $this->clearCacheKeys([
            'storefront:banners:active',
            'storefront:banners:position:hero',
            'storefront:banners:position:sidebar',
            'storefront:banners:position:category_promo',
            'storefront:banners:position:fullwidth_promo',
        ]);

        return $banner->fresh();
    }

    public function delete(int $id): void
    {
        $banner = $this->bannerRepository->findOrFail($id);
        $this->bannerRepository->delete($banner);
        $this->clearCacheKeys([
            'storefront:banners:active',
            'storefront:banners:position:hero',
            'storefront:banners:position:sidebar',
            'storefront:banners:position:category_promo',
            'storefront:banners:position:fullwidth_promo',
        ]);
    }
}
