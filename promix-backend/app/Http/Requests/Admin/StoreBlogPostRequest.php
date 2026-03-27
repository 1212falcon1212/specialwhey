<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:200', 'unique:blog_posts,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_published' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:200'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Blog yazısı başlığı zorunludur.',
            'title.max' => 'Başlık en fazla 200 karakter olabilir.',
            'slug.required' => 'URL slug zorunludur.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'excerpt.max' => 'Özet en fazla 500 karakter olabilir.',
            'image.max' => 'Görsel yolu en fazla 500 karakter olabilir.',
            'published_at.date' => 'Yayın tarihi geçerli bir tarih olmalıdır.',
            'meta_title.max' => 'Meta başlık en fazla 200 karakter olabilir.',
            'meta_description.max' => 'Meta açıklama en fazla 500 karakter olabilir.',
        ];
    }
}
