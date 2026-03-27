<?php

namespace App\Services\Admin;

use App\Models\BlogPost;
use App\Repositories\Admin\BlogPostRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class BlogPostService
{
    public function __construct(
        private readonly BlogPostRepository $blogPostRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->blogPostRepository->paginate($filters);
    }

    public function findOrFail(int $id): BlogPost
    {
        return $this->blogPostRepository->findOrFail($id);
    }

    public function create(array $data): BlogPost
    {
        return $this->blogPostRepository->create($data);
    }

    public function update(int $id, array $data): BlogPost
    {
        $post = $this->blogPostRepository->findOrFail($id);
        $this->blogPostRepository->update($post, $data);

        return $post->fresh()->load('author:id,name');
    }

    public function delete(int $id): void
    {
        $post = $this->blogPostRepository->findOrFail($id);
        $this->blogPostRepository->delete($post);
    }
}
