<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class CalculatePriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|integer|exists:ingredients,id',
            'items.*.option_id' => 'nullable|integer|exists:ingredient_options,id',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'En az bir bileşen seçmelisiniz.',
            'items.*.ingredient_id.required' => 'Bileşen seçimi zorunludur.',
            'items.*.ingredient_id.exists' => 'Seçilen bileşen bulunamadı.',
            'items.*.option_id.exists' => 'Seçilen seçenek bulunamadı.',
        ];
    }
}
