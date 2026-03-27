<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:200', 'unique:pages,slug'],
            'content' => ['required', 'string'],
            'meta_title' => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Sayfa başlığı zorunludur.',
            'title.max' => 'Sayfa başlığı en fazla 200 karakter olabilir.',
            'slug.required' => 'Slug zorunludur.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'slug.max' => 'Slug en fazla 200 karakter olabilir.',
            'content.required' => 'Sayfa içeriği zorunludur.',
            'meta_title.max' => 'Meta başlık en fazla 200 karakter olabilir.',
            'meta_description.max' => 'Meta açıklama en fazla 500 karakter olabilir.',
            'sort_order.integer' => 'Sıralama değeri bir sayı olmalıdır.',
            'sort_order.min' => 'Sıralama değeri en az 0 olmalıdır.',
        ];
    }
}
