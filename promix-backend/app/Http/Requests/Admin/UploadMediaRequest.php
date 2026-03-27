<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,gif,webp,svg'],
            'collection' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Dosya zorunludur.',
            'file.max' => 'Dosya boyutu en fazla 5MB olabilir.',
            'file.mimes' => 'Sadece jpg, png, gif, webp ve svg dosyaları yüklenebilir.',
        ];
    }
}
