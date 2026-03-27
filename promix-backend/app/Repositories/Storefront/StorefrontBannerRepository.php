<?php

namespace App\Repositories\Storefront;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

class StorefrontBannerRepository
{
    public function getActive(): Collection
    {
        return Banner::active()
            ->orderBy('sort_order')
            ->get();
    }

    public function getByPosition(string $position): Collection
    {
        return Banner::active()
            ->where('position', $position)
            ->orderBy('sort_order')
            ->get();
    }
}
