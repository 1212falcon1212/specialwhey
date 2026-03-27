<?php

namespace App\Enums;

enum IngredientUnit: string
{
    case Gram = 'gram';
    case Ml = 'ml';
    case Adet = 'adet';

    public function label(): string
    {
        return match ($this) {
            self::Gram => 'Gram',
            self::Ml => 'Mililitre',
            self::Adet => 'Adet',
        };
    }
}
