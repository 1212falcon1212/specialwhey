<?php

namespace App\Repositories;

use App\Models\MixerTemplate;
use Illuminate\Pagination\LengthAwarePaginator;

class MixerTemplateRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = MixerTemplate::with(['items.ingredient', 'items.option']);

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        $sortBy = $filters['sort_by'] ?? 'sort_order';
        $sortDir = $filters['sort_dir'] ?? 'asc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findOrFail(int $id): MixerTemplate
    {
        return MixerTemplate::with(['items.ingredient.options', 'items.option'])->findOrFail($id);
    }

    public function create(array $data): MixerTemplate
    {
        return MixerTemplate::create($data);
    }

    public function update(MixerTemplate $template, array $data): MixerTemplate
    {
        $template->update($data);

        return $template;
    }

    public function delete(MixerTemplate $template): void
    {
        $template->delete();
    }
}
