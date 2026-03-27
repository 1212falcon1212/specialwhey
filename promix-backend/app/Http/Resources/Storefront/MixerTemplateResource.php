<?php

namespace App\Http\Resources\Storefront;

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
            'is_featured' => $this->is_featured,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'ingredient_id' => $item->ingredient_id,
                'ingredient_option_id' => $item->ingredient_option_id,
                'is_required' => $item->is_required,
                'sort_order' => $item->sort_order,
                'ingredient' => $item->relationLoaded('ingredient') ? [
                    'id' => $item->ingredient->id,
                    'name' => $item->ingredient->name,
                    'slug' => $item->ingredient->slug,
                    'image' => $item->ingredient->image,
                    'base_price' => (float) $item->ingredient->base_price,
                    'unit' => $item->ingredient->unit?->value,
                    'unit_label' => $item->ingredient->unit?->label(),
                    'options' => $item->ingredient->relationLoaded('options')
                        ? $item->ingredient->options->map(fn ($option) => [
                            'id' => $option->id,
                            'label' => $option->label,
                            'amount' => (float) $option->amount,
                            'price' => (float) $option->price,
                        ])
                        : null,
                ] : null,
                'option' => $item->relationLoaded('option') && $item->option ? [
                    'id' => $item->option->id,
                    'label' => $item->option->label,
                    'amount' => (float) $item->option->amount,
                    'price' => (float) $item->option->price,
                ] : null,
            ])),
        ];
    }
}
