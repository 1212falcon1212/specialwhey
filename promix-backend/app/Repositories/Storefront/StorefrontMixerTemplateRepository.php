<?php

namespace App\Repositories\Storefront;

use App\Models\MixerTemplate;
use Illuminate\Database\Eloquent\Collection;

class StorefrontMixerTemplateRepository
{
    public function getAll(): Collection
    {
        return MixerTemplate::active()
            ->with('items.ingredient.options', 'items.option')
            ->orderBy('sort_order')
            ->get();
    }

    public function findBySlug(string $slug): MixerTemplate
    {
        return MixerTemplate::active()
            ->where('slug', $slug)
            ->with('items.ingredient.options', 'items.option')
            ->firstOrFail();
    }
}
