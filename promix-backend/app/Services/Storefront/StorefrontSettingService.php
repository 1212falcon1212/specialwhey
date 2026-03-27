<?php

namespace App\Services\Storefront;

use App\Repositories\Storefront\StorefrontSettingRepository;
use Illuminate\Support\Facades\Cache;

class StorefrontSettingService
{
    public function __construct(
        private readonly StorefrontSettingRepository $settingRepository
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getPublic(): array
    {
        return Cache::remember('storefront:settings:public', 3600, function () {
            return $this->settingRepository->getPublic();
        });
    }
}
