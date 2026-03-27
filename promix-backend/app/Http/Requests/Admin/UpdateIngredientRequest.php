<?php

namespace App\Http\Requests\Admin;

use App\Enums\IngredientUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIngredientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ingredientId = $this->route('ingredient');

        return [
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('ingredients', 'slug')->ignore($ingredientId)],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'base_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'required', Rule::enum(IngredientUnit::class)],
            'unit_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock_quantity' => ['sometimes', 'required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', Rule::unique('ingredients', 'sku')->ignore($ingredientId)],
            'nutritional_info' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'options' => ['nullable', 'array'],
            'options.*.label' => ['required_with:options', 'string', 'max:255'],
            'options.*.amount' => ['required_with:options', 'numeric', 'min:0'],
            'options.*.price' => ['required_with:options', 'numeric', 'min:0'],
            'options.*.stock_quantity' => ['required_with:options', 'integer', 'min:0'],
            'options.*.is_default' => ['boolean'],
            'options.*.sort_order' => ['integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bileşen adı zorunludur.',
            'category_id.exists' => 'Seçilen kategori bulunamadı.',
            'base_price.min' => 'Fiyat 0\'dan küçük olamaz.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'sku.unique' => 'Bu SKU zaten kullanılıyor.',
        ];
    }
}
