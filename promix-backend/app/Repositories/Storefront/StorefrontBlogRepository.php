<?php

namespace App\Repositories\Storefront;

use App\Models\BlogPost;
use Illuminate\Pagination\LengthAwarePaginator;

class StorefrontBlogRepository
{
    public function paginate(int $perPage = 12): LengthAwarePaginator
    {
        return BlogPost::published()
            ->with('author:id,name')
            ->orderByDesc('published_at')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): ?BlogPost
    {
        return BlogPost::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->first();
    }
}
