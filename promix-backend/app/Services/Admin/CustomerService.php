<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\User;
use App\Repositories\Admin\CustomerRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerService
{
    public function __construct(
        private readonly CustomerRepository $customerRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->customerRepository->paginate($filters);
    }

    public function findOrFail(int $id): User
    {
        return $this->customerRepository->findOrFail($id);
    }

    public function getTotalSpent(User $user): float
    {
        return (float) Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->sum('total');
    }
}
