<?php

namespace App\Repositories\Admin;

use App\Models\BlogPost;
use Illuminate\Pagination\LengthAwarePaginator;

class BlogPostRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = BlogPost::with('author:id,name')
            ->orderByDesc('created_at');

        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        }

        return $query->paginate($perPage);
    }

    public function findOrFail(int $id): BlogPost
    {
        return BlogPost::with('author:id,name')->findOrFail($id);
    }

    public function create(array $data): BlogPost
    {
        return BlogPost::create($data);
    }

    public function update(BlogPost $post, array $data): BlogPost
    {
        $post->update($data);

        return $post;
    }

    public function delete(BlogPost $post): void
    {
        $post->delete();
    }
}
