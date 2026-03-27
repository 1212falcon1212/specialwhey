<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMixerTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:mixer_templates,slug'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'items' => ['nullable', 'array'],
            'items.*.ingredient_id' => ['required_with:items', 'exists:ingredients,id'],
            'items.*.ingredient_option_id' => ['nullable', 'exists:ingredient_options,id'],
            'items.*.is_required' => ['boolean'],
            'items.*.sort_order' => ['integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Şablon adı zorunludur.',
            'slug.required' => 'Slug zorunludur.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'items.*.ingredient_id.required_with' => 'Bileşen seçimi zorunludur.',
            'items.*.ingredient_id.exists' => 'Seçilen bileşen bulunamadı.',
        ];
    }
}
