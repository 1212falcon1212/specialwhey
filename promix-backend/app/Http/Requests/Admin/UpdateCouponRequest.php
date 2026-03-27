<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($this->route('id'))],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:starts_at'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kupon kodu zorunludur.',
            'code.unique' => 'Bu kupon kodu zaten kullanılıyor.',
            'code.max' => 'Kupon kodu en fazla 50 karakter olabilir.',
            'type.required' => 'Kupon tipi zorunludur.',
            'type.in' => 'Kupon tipi yüzde veya sabit tutar olmalıdır.',
            'value.required' => 'İndirim değeri zorunludur.',
            'value.numeric' => 'İndirim değeri sayısal olmalıdır.',
            'value.min' => 'İndirim değeri en az 0 olmalıdır.',
            'min_order_amount.numeric' => 'Minimum sipariş tutarı sayısal olmalıdır.',
            'min_order_amount.min' => 'Minimum sipariş tutarı en az 0 olmalıdır.',
            'usage_limit.integer' => 'Kullanım limiti bir sayı olmalıdır.',
            'usage_limit.min' => 'Kullanım limiti en az 1 olmalıdır.',
            'starts_at.date' => 'Başlangıç tarihi geçerli bir tarih olmalıdır.',
            'expires_at.date' => 'Bitiş tarihi geçerli bir tarih olmalıdır.',
            'expires_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
        ];
    }
}
