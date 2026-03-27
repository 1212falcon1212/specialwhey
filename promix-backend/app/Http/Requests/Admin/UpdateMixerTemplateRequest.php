<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMixerTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $templateId = $this->route('mixer_template');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('mixer_templates', 'slug')->ignore($templateId)],
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
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'items.*.ingredient_id.exists' => 'Seçilen bileşen bulunamadı.',
        ];
    }
}
