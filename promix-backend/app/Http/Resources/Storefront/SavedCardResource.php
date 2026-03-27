<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavedCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'card_label' => $this->card_label,
            'last_four' => $this->last_four,
            'card_brand' => $this->card_brand,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
