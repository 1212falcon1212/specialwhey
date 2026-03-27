<?php

namespace App\Services;

use App\Models\MixerTemplate;
use App\Repositories\MixerTemplateRepository;
use App\Services\Traits\ClearsCacheKeys;
use Illuminate\Pagination\LengthAwarePaginator;

class MixerTemplateService
{
    use ClearsCacheKeys;

    public function __construct(
        private readonly MixerTemplateRepository $mixerTemplateRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->mixerTemplateRepository->paginate($filters);
    }

    public function findOrFail(int $id): MixerTemplate
    {
        return $this->mixerTemplateRepository->findOrFail($id);
    }

    public function create(array $data): MixerTemplate
    {
        $items = $data['items'] ?? [];
        unset($data['items']);

        $template = $this->mixerTemplateRepository->create($data);

        foreach ($items as $index => $item) {
            $item['sort_order'] = $item['sort_order'] ?? $index;
            $template->items()->create($item);
        }

        $this->clearCacheKeys(['storefront:mixer:templates', "storefront:mixer:templates:slug:{$template->slug}"]);

        return $template->load(['items.ingredient', 'items.option']);
    }

    public function update(int $id, array $data): MixerTemplate
    {
        $template = $this->mixerTemplateRepository->findOrFail($id);

        $items = $data['items'] ?? null;
        unset($data['items']);

        $this->mixerTemplateRepository->update($template, $data);

        if ($items !== null) {
            $template->items()->delete();
            foreach ($items as $index => $item) {
                $item['sort_order'] = $item['sort_order'] ?? $index;
                $template->items()->create($item);
            }
        }

        $this->clearCacheKeys(['storefront:mixer:templates', "storefront:mixer:templates:slug:{$template->slug}"]);

        return $template->fresh(['items.ingredient', 'items.option']);
    }

    public function delete(int $id): void
    {
        $template = $this->mixerTemplateRepository->findOrFail($id);
        $slug = $template->slug;
        $this->mixerTemplateRepository->delete($template);
        $this->clearCacheKeys(['storefront:mixer:templates', "storefront:mixer:templates:slug:{$slug}"]);
    }
}
