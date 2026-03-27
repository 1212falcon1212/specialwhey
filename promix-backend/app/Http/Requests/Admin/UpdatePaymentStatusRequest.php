<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_status' => ['required', 'string', 'in:pending,success,failed'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_status.required' => 'Ödeme durumu zorunludur.',
            'payment_status.in' => 'Geçersiz ödeme durumu.',
        ];
    }
}
