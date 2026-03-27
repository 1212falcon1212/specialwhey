<?php

namespace App\Enums;

enum BannerPosition: string
{
    case Hero = 'hero';
    case Sidebar = 'sidebar';
    case CategoryPromo = 'category_promo';
    case FullwidthPromo = 'fullwidth_promo';

    public function label(): string
    {
        return match ($this) {
            self::Hero => 'Hero Banner',
            self::Sidebar => 'Sidebar Banner',
            self::CategoryPromo => 'Kategori Promo',
            self::FullwidthPromo => 'Tam Genişlik Promo',
        };
    }
}
