<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Services\Storefront\StorefrontSettingService;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontSettingService $settingService
    ) {}

    public function index(): JsonResponse
    {
        $settings = $this->settingService->getPublic();

        return $this->success($settings);
    }
}
