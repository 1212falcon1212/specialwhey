<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;
use App\Repositories\AddressRepository;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class AddressService
{
    public function __construct(
        private readonly AddressRepository $repository
    ) {}

    public function getAll(User $user): Collection
    {
        return $this->repository->getByUser($user);
    }

    public function create(User $user, array $data): Address
    {
        $data['user_id'] = $user->id;

        if (! empty($data['is_default'])) {
            $this->repository->setDefault($user, new Address);
            // Above resets all, the new one will be created with is_default=true
        }

        return $this->repository->create($data);
    }

    public function update(int $id, User $user, array $data): Address
    {
        $address = $this->repository->findOrFail($id);

        if ($address->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu adrese erişim yetkiniz yok.');
        }

        if (! empty($data['is_default'])) {
            $this->repository->setDefault($user, $address);
        }

        return $this->repository->update($address, $data);
    }

    public function delete(int $id, User $user): void
    {
        $address = $this->repository->findOrFail($id);

        if ($address->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu adrese erişim yetkiniz yok.');
        }

        $this->repository->delete($address);
    }
}
