<?php

namespace App\Http\Requests\Admin;

use App\Enums\IngredientUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIngredientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:ingredients,slug'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', Rule::enum(IngredientUnit::class)],
            'unit_amount' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'unique:ingredients,sku'],
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
            'category_id.required' => 'Kategori seçimi zorunludur.',
            'category_id.exists' => 'Seçilen kategori bulunamadı.',
            'base_price.required' => 'Fiyat zorunludur.',
            'base_price.min' => 'Fiyat 0\'dan küçük olamaz.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'sku.unique' => 'Bu SKU zaten kullanılıyor.',
            'unit.required' => 'Birim seçimi zorunludur.',
            'unit_amount.required' => 'Birim miktarı zorunludur.',
            'stock_quantity.required' => 'Stok miktarı zorunludur.',
        ];
    }
}
