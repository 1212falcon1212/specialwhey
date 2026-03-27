<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\ChangePasswordRequest;
use App\Http\Requests\Storefront\UpdateProfileRequest;
use App\Http\Resources\Storefront\ProfileResource;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AccountService $service
    ) {}

    public function show(Request $request): JsonResponse
    {
        $user = $this->service->getProfile($request->user());

        return $this->success(new ProfileResource($user), 'Profil bilgileri getirildi.');
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->service->updateProfile($request->user(), $request->validated());

        return $this->success(new ProfileResource($user), 'Profil başarıyla güncellendi.');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->service->changePassword($request->user(), $request->validated());

        return $this->success(null, 'Şifre başarıyla güncellendi.');
    }
}
