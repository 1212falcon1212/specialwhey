<?php

namespace App\Services;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class FavoriteService
{
    public function getAll(User $user, array $filters): LengthAwarePaginator
    {
        return Favorite::with('ingredient.category', 'ingredient.options')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 12);
    }

    public function toggle(User $user, int $ingredientId): array
    {
        $favorite = Favorite::where('user_id', $user->id)
            ->where('ingredient_id', $ingredientId)
            ->first();

        if ($favorite) {
            $favorite->delete();

            return ['action' => 'removed'];
        }

        Favorite::create([
            'user_id' => $user->id,
            'ingredient_id' => $ingredientId,
        ]);

        return ['action' => 'added'];
    }

    public function getIds(User $user): array
    {
        return Favorite::where('user_id', $user->id)
            ->pluck('ingredient_id')
            ->toArray();
    }
}
