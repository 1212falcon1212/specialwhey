<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    protected $fillable = [
        'model_type',
        'model_id',
        'collection',
        'filename',
        'path',
        'mime_type',
        'size',
        'sort_order',
    ];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
