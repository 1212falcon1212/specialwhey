<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $ingredient = $this->ingredient;

        return [
            'id' => $ingredient->id,
            'name' => $ingredient->name,
            'slug' => $ingredient->slug,
            'short_description' => $ingredient->short_description,
            'image' => $ingredient->image,
            'base_price' => (float) $ingredient->base_price,
            'unit' => $ingredient->unit?->value,
            'unit_label' => $ingredient->unit?->label(),
            'is_featured' => $ingredient->is_featured,
            'category' => $this->whenLoaded('ingredient', fn () => $ingredient->category ? [
                'id' => $ingredient->category->id,
                'name' => $ingredient->category->name,
                'slug' => $ingredient->category->slug,
            ] : null),
            'options' => $this->whenLoaded('ingredient', fn () => $ingredient->options?->map(fn ($option) => [
                'id' => $option->id,
                'label' => $option->label,
                'amount' => (float) $option->amount,
                'price' => (float) $option->price,
                'is_default' => $option->is_default,
                'sort_order' => $option->sort_order,
            ])),
            'favorited_at' => $this->created_at?->toISOString(),
        ];
    }
}
