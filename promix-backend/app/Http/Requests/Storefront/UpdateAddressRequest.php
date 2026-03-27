<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:50'],
            'full_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'neighborhood' => ['nullable', 'string', 'max:100'],
            'address_line' => ['required', 'string', 'max:500'],
            'zip_code' => ['nullable', 'string', 'max:10'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Adres başlığı zorunludur.',
            'title.max' => 'Adres başlığı en fazla 50 karakter olabilir.',
            'full_name.required' => 'Ad soyad zorunludur.',
            'full_name.max' => 'Ad soyad en fazla 100 karakter olabilir.',
            'phone.required' => 'Telefon numarası zorunludur.',
            'phone.max' => 'Telefon numarası en fazla 20 karakter olabilir.',
            'city.required' => 'Şehir zorunludur.',
            'city.max' => 'Şehir en fazla 100 karakter olabilir.',
            'district.required' => 'İlçe zorunludur.',
            'district.max' => 'İlçe en fazla 100 karakter olabilir.',
            'neighborhood.max' => 'Mahalle en fazla 100 karakter olabilir.',
            'address_line.required' => 'Adres satırı zorunludur.',
            'address_line.max' => 'Adres satırı en fazla 500 karakter olabilir.',
            'zip_code.max' => 'Posta kodu en fazla 10 karakter olabilir.',
            'is_default.boolean' => 'Varsayılan adres alanı doğru/yanlış olmalıdır.',
        ];
    }
}
