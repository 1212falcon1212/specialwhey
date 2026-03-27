<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Havale = 'havale';
    case KrediKarti = 'kredi_karti';

    public function label(): string
    {
        return match ($this) {
            self::Havale => 'Havale/EFT',
            self::KrediKarti => 'Kredi Kartı',
        };
    }
}
