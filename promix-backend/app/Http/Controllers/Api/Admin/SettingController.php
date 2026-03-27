<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Admin\SettingResource;
use App\Services\Admin\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SettingService $settingService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $settings = $this->settingService->getAll();

        $grouped = $settings->map(function ($items, $group) {
            return SettingResource::collection($items);
        });

        return $this->success($grouped);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable'],
        ], [
            'settings.required' => 'Ayar verileri zorunludur.',
            'settings.array' => 'Ayar verileri bir dizi olmalıdır.',
        ]);

        $settings = $this->settingService->update($validated['settings']);

        $grouped = $settings->map(function ($items, $group) {
            return SettingResource::collection($items);
        });

        return $this->success($grouped, 'Ayarlar başarıyla güncellendi.');
    }
}
