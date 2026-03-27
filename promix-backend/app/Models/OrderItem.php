<?php

namespace App\Models;

use App\Enums\OrderItemType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'type',
        'ingredient_id',
        'ingredient_option_id',
        'mixer_snapshot',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'type' => OrderItemType::class,
        'mixer_snapshot' => 'array',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(IngredientOption::class, 'ingredient_option_id');
    }
}
