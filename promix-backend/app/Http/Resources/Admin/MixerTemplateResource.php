<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MixerTemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'ingredient_id' => $item->ingredient_id,
                'ingredient_option_id' => $item->ingredient_option_id,
                'is_required' => $item->is_required,
                'sort_order' => $item->sort_order,
                'ingredient' => $item->relationLoaded('ingredient') && $item->ingredient ? [
                    'id' => $item->ingredient->id,
                    'name' => $item->ingredient->name,
                    'slug' => $item->ingredient->slug,
                    'base_price' => (float) $item->ingredient->base_price,
                    'image' => $item->ingredient->image,
                ] : null,
                'option' => $item->relationLoaded('option') && $item->option ? [
                    'id' => $item->option->id,
                    'label' => $item->option->label,
                    'price' => (float) $item->option->price,
                ] : null,
            ])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
