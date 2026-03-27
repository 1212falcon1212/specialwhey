<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image,
            'children' => $this->whenLoaded('children', fn () => CategoryResource::collection($this->children)),
            'ingredient_count' => $this->whenCounted('ingredients'),
        ];
    }
}
