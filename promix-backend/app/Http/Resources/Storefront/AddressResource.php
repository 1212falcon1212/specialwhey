<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'city' => $this->city,
            'district' => $this->district,
            'neighborhood' => $this->neighborhood,
            'address_line' => $this->address_line,
            'zip_code' => $this->zip_code,
            'is_default' => $this->is_default,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
