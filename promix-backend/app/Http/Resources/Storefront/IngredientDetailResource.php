<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'image' => $this->image,
            'gallery' => $this->gallery,
            'base_price' => (float) $this->base_price,
            'unit' => $this->unit?->value,
            'unit_label' => $this->unit?->label(),
            'is_featured' => $this->is_featured,
            'nutritional_info' => $this->nutritional_info,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'options' => $this->whenLoaded('options', fn () => $this->options->map(fn ($option) => [
                'id' => $option->id,
                'label' => $option->label,
                'amount' => (float) $option->amount,
                'price' => (float) $option->price,
                'is_default' => $option->is_default,
                'sort_order' => $option->sort_order,
            ])),
        ];
    }
}
