<?php

namespace App\Enums;

enum OrderItemType: string
{
    case Ingredient = 'ingredient';
    case Mixer = 'mixer';

    public function label(): string
    {
        return match ($this) {
            self::Ingredient => 'Bileşen',
            self::Mixer => 'Karışım',
        };
    }
}
