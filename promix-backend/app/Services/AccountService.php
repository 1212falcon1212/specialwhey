<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\AccountRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountService
{
    public function __construct(
        private readonly AccountRepository $repository
    ) {}

    public function getProfile(User $user): User
    {
        $user->load('addresses');

        return $user;
    }

    public function updateProfile(User $user, array $data): User
    {
        return $this->repository->update($user, $data);
    }

    public function changePassword(User $user, array $data): void
    {
        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mevcut şifre yanlış.'],
            ]);
        }

        $user->update([
            'password' => $data['new_password'],
        ]);
    }
}
