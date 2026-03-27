<?php

namespace App\Services;

use App\Models\SavedCard;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class SavedCardService
{
    public function getAll(User $user): Collection
    {
        return SavedCard::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->get();
    }

    public function create(User $user, array $data): SavedCard
    {
        $data['user_id'] = $user->id;

        if (! empty($data['is_default'])) {
            SavedCard::where('user_id', $user->id)->update(['is_default' => false]);
        }

        return SavedCard::create($data);
    }

    public function delete(int $id, User $user): void
    {
        $card = SavedCard::findOrFail($id);

        if ($card->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu karta erişim yetkiniz yok.');
        }

        $card->delete();
    }

    public function setDefault(int $id, User $user): SavedCard
    {
        $card = SavedCard::findOrFail($id);

        if ($card->user_id !== $user->id) {
            throw new AccessDeniedHttpException('Bu karta erişim yetkiniz yok.');
        }

        SavedCard::where('user_id', $user->id)->update(['is_default' => false]);
        $card->update(['is_default' => true]);

        return $card;
    }
}
