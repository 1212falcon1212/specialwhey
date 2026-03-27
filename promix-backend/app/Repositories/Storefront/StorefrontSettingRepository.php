<?php

namespace App\Repositories\Storefront;

use App\Models\Setting;

class StorefrontSettingRepository
{
    /**
     * @return array<string, mixed>
     */
    public function getPublic(): array
    {
        return Setting::whereIn('group', ['general', 'shipping', 'social', 'storefront'])
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }
}
