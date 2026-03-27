<?php

namespace App\Enums;

enum RefundReason: string
{
    case Defective = 'defective';
    case WrongProduct = 'wrong_product';
    case NotAsDescribed = 'not_as_described';
    case ChangedMind = 'changed_mind';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Defective => 'Ürün Hasarlı/Kusurlu',
            self::WrongProduct => 'Yanlış Ürün Gönderildi',
            self::NotAsDescribed => 'Ürün Açıklamaya Uygun Değil',
            self::ChangedMind => 'Fikir Değişikliği',
            self::Other => 'Diğer',
        };
    }
}
