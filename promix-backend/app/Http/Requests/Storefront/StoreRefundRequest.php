<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class StoreRefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'reason' => ['required', 'string', 'in:defective,wrong_product,not_as_described,changed_mind,other'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'Sipariş seçimi zorunludur.',
            'order_id.integer' => 'Sipariş ID geçerli bir sayı olmalıdır.',
            'order_id.exists' => 'Seçilen sipariş bulunamadı.',
            'reason.required' => 'İade nedeni zorunludur.',
            'reason.in' => 'Geçersiz iade nedeni seçildi.',
            'description.max' => 'Açıklama en fazla 1000 karakter olabilir.',
        ];
    }
}
