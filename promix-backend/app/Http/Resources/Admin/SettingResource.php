<?php

namespace App\Http\Resources\Admin;

use App\Enums\SettingType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group' => $this->group,
            'key' => $this->key,
            'value' => $this->parsedValue(),
            'type' => $this->type->value,
            'label' => $this->label,
        ];
    }

    private function parsedValue(): mixed
    {
        return match ($this->type) {
            SettingType::Boolean => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            SettingType::Json => json_decode($this->value, true),
            default => $this->value,
        };
    }
}
