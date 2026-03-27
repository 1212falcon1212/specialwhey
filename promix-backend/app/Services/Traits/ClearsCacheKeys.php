<?php

namespace App\Services\Traits;

use Illuminate\Support\Facades\Cache;

trait ClearsCacheKeys
{
    protected function clearCacheKeys(array $keys): void
    {
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }
}
