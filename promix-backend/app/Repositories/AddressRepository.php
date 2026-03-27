<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class AddressRepository
{
    public function getByUser(User $user): Collection
    {
        return Address::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }

    public function findOrFail(int $id): Address
    {
        return Address::findOrFail($id);
    }

    public function create(array $data): Address
    {
        return Address::create($data);
    }

    public function update(Address $address, array $data): Address
    {
        $address->update($data);

        return $address;
    }

    public function delete(Address $address): void
    {
        $address->delete();
    }

    public function setDefault(User $user, Address $address): void
    {
        Address::where('user_id', $user->id)->update(['is_default' => false]);

        $address->update(['is_default' => true]);
    }
}
