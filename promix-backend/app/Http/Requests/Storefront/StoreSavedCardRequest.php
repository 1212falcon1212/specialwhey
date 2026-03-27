<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class StoreSavedCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'card_label' => ['required', 'string', 'max:50'],
            'last_four' => ['required', 'string', 'size:4'],
            'card_brand' => ['nullable', 'string', 'in:Visa,Mastercard,Troy'],
            'card_token' => ['required', 'string'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'card_label.required' => 'Kart etiketi zorunludur.',
            'card_label.max' => 'Kart etiketi en fazla 50 karakter olabilir.',
            'last_four.required' => 'Kartın son 4 hanesi zorunludur.',
            'last_four.size' => 'Kartın son 4 hanesi tam olarak 4 karakter olmalıdır.',
            'card_brand.in' => 'Kart markası Visa, Mastercard veya Troy olmalıdır.',
            'card_token.required' => 'Kart token zorunludur.',
            'is_default.boolean' => 'Varsayılan kart alanı doğru/yanlış olmalıdır.',
        ];
    }
}
