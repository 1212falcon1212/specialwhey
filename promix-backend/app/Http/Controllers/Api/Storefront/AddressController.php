<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\StoreAddressRequest;
use App\Http\Requests\Storefront\UpdateAddressRequest;
use App\Http\Resources\Storefront\AddressResource;
use App\Services\AddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AddressService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $addresses = $this->service->getAll($request->user());

        return $this->success(AddressResource::collection($addresses), 'Adresler listelendi.');
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $address = $this->service->create($request->user(), $request->validated());

        return $this->created(new AddressResource($address), 'Adres başarıyla eklendi.');
    }

    public function update(UpdateAddressRequest $request, int $id): JsonResponse
    {
        $address = $this->service->update($id, $request->user(), $request->validated());

        return $this->success(new AddressResource($address), 'Adres başarıyla güncellendi.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $request->user());

        return $this->deleted('Adres başarıyla silindi.');
    }
}
