<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.type' => ['required', 'in:ingredient,mixer'],
            'items.*.ingredient_id' => ['required_if:items.*.type,ingredient', 'nullable', 'integer', 'exists:ingredients,id'],
            'items.*.option_id' => ['nullable', 'integer', 'exists:ingredient_options,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.mixer_items' => ['required_if:items.*.type,mixer', 'nullable', 'array'],
            'items.*.mixer_items.*.ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'items.*.mixer_items.*.option_id' => ['nullable', 'integer', 'exists:ingredient_options,id'],

            'billing_address' => ['required', 'array'],
            'billing_address.full_name' => ['required', 'string', 'max:100'],
            'billing_address.phone' => ['required', 'string', 'max:20'],
            'billing_address.city' => ['required', 'string', 'max:100'],
            'billing_address.district' => ['required', 'string', 'max:100'],
            'billing_address.address_line' => ['required', 'string', 'max:500'],
            'billing_address.zip_code' => ['nullable', 'string', 'max:10'],

            'shipping_address' => ['nullable', 'array'],
            'shipping_address.full_name' => ['required_with:shipping_address', 'string', 'max:100'],
            'shipping_address.phone' => ['required_with:shipping_address', 'string', 'max:20'],
            'shipping_address.city' => ['required_with:shipping_address', 'string', 'max:100'],
            'shipping_address.district' => ['required_with:shipping_address', 'string', 'max:100'],
            'shipping_address.address_line' => ['required_with:shipping_address', 'string', 'max:500'],
            'shipping_address.zip_code' => ['nullable', 'string', 'max:10'],

            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Sepetinizde en az bir ürün olmalıdır.',
            'items.min' => 'Sepetinizde en az bir ürün olmalıdır.',
            'items.*.type.required' => 'Ürün tipi belirtilmelidir.',
            'items.*.type.in' => 'Geçersiz ürün tipi.',
            'items.*.ingredient_id.required_if' => 'Bileşen ID belirtilmelidir.',
            'items.*.ingredient_id.exists' => 'Seçilen bileşen bulunamadı.',
            'items.*.option_id.exists' => 'Seçilen seçenek bulunamadı.',
            'items.*.quantity.required' => 'Ürün adedi belirtilmelidir.',
            'items.*.quantity.min' => 'Ürün adedi en az 1 olmalıdır.',
            'items.*.mixer_items.required_if' => 'Karışım bileşenleri belirtilmelidir.',
            'items.*.mixer_items.*.ingredient_id.required' => 'Karışım bileşen ID belirtilmelidir.',
            'items.*.mixer_items.*.ingredient_id.exists' => 'Seçilen karışım bileşeni bulunamadı.',
            'items.*.mixer_items.*.option_id.exists' => 'Seçilen karışım seçeneği bulunamadı.',

            'billing_address.required' => 'Fatura adresi zorunludur.',
            'billing_address.full_name.required' => 'Ad soyad zorunludur.',
            'billing_address.full_name.max' => 'Ad soyad en fazla 100 karakter olabilir.',
            'billing_address.phone.required' => 'Telefon numarası zorunludur.',
            'billing_address.phone.max' => 'Telefon numarası en fazla 20 karakter olabilir.',
            'billing_address.city.required' => 'Şehir zorunludur.',
            'billing_address.city.max' => 'Şehir en fazla 100 karakter olabilir.',
            'billing_address.district.required' => 'İlçe zorunludur.',
            'billing_address.district.max' => 'İlçe en fazla 100 karakter olabilir.',
            'billing_address.address_line.required' => 'Adres zorunludur.',
            'billing_address.address_line.max' => 'Adres en fazla 500 karakter olabilir.',
            'billing_address.zip_code.max' => 'Posta kodu en fazla 10 karakter olabilir.',

            'shipping_address.full_name.required_with' => 'Teslimat adresi için ad soyad zorunludur.',
            'shipping_address.phone.required_with' => 'Teslimat adresi için telefon zorunludur.',
            'shipping_address.city.required_with' => 'Teslimat adresi için şehir zorunludur.',
            'shipping_address.district.required_with' => 'Teslimat adresi için ilçe zorunludur.',
            'shipping_address.address_line.required_with' => 'Teslimat adresi için adres zorunludur.',

            'notes.max' => 'Sipariş notu en fazla 500 karakter olabilir.',
        ];
    }
}
