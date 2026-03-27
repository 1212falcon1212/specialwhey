<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string', 'max:500'],
            'mobile_image' => ['nullable', 'string', 'max:500'],
            'link' => ['nullable', 'string', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:starts_at'],
            'position' => ['nullable', 'string', 'in:hero,sidebar,category_promo,fullwidth_promo,lifestyle,process'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Banner başlığı zorunludur.',
            'title.max' => 'Banner başlığı en fazla 200 karakter olabilir.',
            'subtitle.max' => 'Alt başlık en fazla 500 karakter olabilir.',
            'image.max' => 'Görsel yolu en fazla 500 karakter olabilir.',
            'mobile_image.max' => 'Mobil görsel yolu en fazla 500 karakter olabilir.',
            'link.max' => 'Link en fazla 500 karakter olabilir.',
            'button_text.max' => 'Buton metni en fazla 100 karakter olabilir.',
            'sort_order.integer' => 'Sıralama değeri bir sayı olmalıdır.',
            'sort_order.min' => 'Sıralama değeri en az 0 olmalıdır.',
            'starts_at.date' => 'Başlangıç tarihi geçerli bir tarih olmalıdır.',
            'expires_at.date' => 'Bitiş tarihi geçerli bir tarih olmalıdır.',
            'expires_at.after' => 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır.',
            'position.in' => 'Banner pozisyonu geçerli değil.',
        ];
    }
}
