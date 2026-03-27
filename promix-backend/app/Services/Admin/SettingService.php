<?php

namespace App\Services\Admin;

use App\Models\Setting;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Support\Collection;

class SettingService
{
    use ClearsCacheKeys;

    public function getAll(): Collection
    {
        return Setting::orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group');
    }

    public function getByGroup(string $group): Collection
    {
        return Setting::where('group', $group)
            ->orderBy('key')
            ->get();
    }

    public function update(array $settings): Collection
    {
        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }

        $this->clearCacheKeys(['storefront:settings:public']);

        return $this->getAll();
    }
}
