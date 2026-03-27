<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Resources\Admin\CustomerDetailResource;
use App\Http\Resources\Admin\CustomerResource;
use App\Services\Admin\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CustomerService $customerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $customers = $this->customerService->getAll($request->all());

        return $this->successWithMeta(
            CustomerResource::collection($customers),
            [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $customer = $this->customerService->findOrFail($id);

        return $this->success(new CustomerDetailResource($customer));
    }
}
