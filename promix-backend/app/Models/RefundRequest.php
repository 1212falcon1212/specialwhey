<?php

namespace App\Models;

use App\Enums\RefundReason;
use App\Enums\RefundStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefundRequest extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'reason',
        'description',
        'status',
        'refund_amount',
        'admin_notes',
        'resolved_at',
    ];

    protected $casts = [
        'reason' => RefundReason::class,
        'status' => RefundStatus::class,
        'refund_amount' => 'decimal:2',
        'resolved_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', RefundStatus::Pending);
    }
}
