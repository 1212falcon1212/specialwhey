<?php

namespace App\Services\Storefront;

use App\Models\Ingredient;
use App\Models\IngredientOption;
use App\Models\MixerTemplate;
use App\Repositories\Storefront\StorefrontMixerTemplateRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class StorefrontMixerService
{
    public function __construct(
        private readonly StorefrontMixerTemplateRepository $mixerTemplateRepository
    ) {}

    public function getTemplates(): Collection
    {
        return Cache::remember('storefront:mixer:templates', 1800, function () {
            return $this->mixerTemplateRepository->getAll();
        });
    }

    public function findTemplateBySlug(string $slug): MixerTemplate
    {
        return Cache::remember("storefront:mixer:templates:slug:{$slug}", 1800, function () use ($slug) {
            return $this->mixerTemplateRepository->findBySlug($slug);
        });
    }

    /**
     * Calculate total price for a custom mix.
     *
     * @param  array<int, array{ingredient_id: int, option_id?: int|null}>  $items
     * @return array{items: array<int, array<string, mixed>>, total: string}
     */
    public function calculatePrice(array $items): array
    {
        $result = [];
        $total = 0;

        foreach ($items as $item) {
            $ingredient = Ingredient::active()->findOrFail($item['ingredient_id']);

            if (! empty($item['option_id'])) {
                $option = IngredientOption::where('ingredient_id', $ingredient->id)
                    ->findOrFail($item['option_id']);

                $price = (float) $option->price;

                $result[] = [
                    'ingredient_id' => $ingredient->id,
                    'ingredient_name' => $ingredient->name,
                    'option_id' => $option->id,
                    'option_label' => $option->label,
                    'price' => number_format($price, 2, '.', ''),
                ];
            } else {
                $price = (float) $ingredient->base_price;

                $result[] = [
                    'ingredient_id' => $ingredient->id,
                    'ingredient_name' => $ingredient->name,
                    'option_id' => null,
                    'option_label' => null,
                    'price' => number_format($price, 2, '.', ''),
                ];
            }

            $total += $price;
        }

        return [
            'items' => $result,
            'total' => number_format($total, 2, '.', ''),
        ];
    }
}
