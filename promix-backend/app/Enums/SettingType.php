<?php

namespace App\Enums;

enum SettingType: string
{
    case String = 'string';
    case Boolean = 'boolean';
    case Json = 'json';
    case Image = 'image';

    public function label(): string
    {
        return match ($this) {
            self::String => 'Metin',
            self::Boolean => 'Evet/Hayır',
            self::Json => 'JSON',
            self::Image => 'Görsel',
        };
    }
}
