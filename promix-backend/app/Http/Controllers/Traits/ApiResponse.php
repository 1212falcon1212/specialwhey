<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success($data = null, string $message = 'İşlem başarılı', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $code);
    }

    protected function successWithMeta($data, array $meta, string $message = 'İşlem başarılı'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => $meta,
            'message' => $message,
        ]);
    }

    protected function error(string $message = 'Bir hata oluştu', int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    protected function notFound(string $message = 'Kayıt bulunamadı'): JsonResponse
    {
        return $this->error($message, 404);
    }

    protected function unauthorized(string $message = 'Yetkisiz erişim'): JsonResponse
    {
        return $this->error($message, 401);
    }

    protected function forbidden(string $message = 'Bu işlem için yetkiniz yok'): JsonResponse
    {
        return $this->error($message, 403);
    }

    protected function validationError($errors, string $message = 'Doğrulama hatası'): JsonResponse
    {
        return $this->error($message, 422, $errors);
    }

    protected function created($data = null, string $message = 'Kayıt başarıyla oluşturuldu'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function deleted(string $message = 'Kayıt başarıyla silindi'): JsonResponse
    {
        return $this->success(null, $message);
    }
}
