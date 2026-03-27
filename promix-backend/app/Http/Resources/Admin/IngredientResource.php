<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'image' => $this->image,
            'gallery' => $this->gallery,
            'base_price' => (float) $this->base_price,
            'unit' => $this->unit?->value,
            'unit_label' => $this->unit?->label(),
            'unit_amount' => (float) $this->unit_amount,
            'stock_quantity' => $this->stock_quantity,
            'sku' => $this->sku,
            'nutritional_info' => $this->nutritional_info,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
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
                'stock_quantity' => $option->stock_quantity,
                'is_default' => $option->is_default,
                'sort_order' => $option->sort_order,
            ])),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
