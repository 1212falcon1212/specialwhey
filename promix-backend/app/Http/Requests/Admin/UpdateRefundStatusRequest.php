<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRefundStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:approved,rejected,refunded'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'İade durumu zorunludur.',
            'status.in' => 'Geçersiz iade durumu.',
            'admin_notes.max' => 'Admin notları en fazla 1000 karakter olabilir.',
        ];
    }
}
