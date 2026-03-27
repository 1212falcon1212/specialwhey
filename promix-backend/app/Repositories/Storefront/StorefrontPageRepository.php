<?php

namespace App\Repositories\Storefront;

use App\Models\Page;

class StorefrontPageRepository
{
    public function findBySlug(string $slug): Page
    {
        return Page::active()
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
