<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Preparing = 'preparing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Beklemede',
            self::Paid => 'Ödendi',
            self::Preparing => 'Hazırlanıyor',
            self::Shipped => 'Kargoda',
            self::Delivered => 'Teslim Edildi',
            self::Cancelled => 'İptal Edildi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'yellow',
            self::Paid => 'blue',
            self::Preparing => 'orange',
            self::Shipped => 'purple',
            self::Delivered => 'green',
            self::Cancelled => 'red',
        };
    }
}
