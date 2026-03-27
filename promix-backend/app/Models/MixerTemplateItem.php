<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MixerTemplateItem extends Model
{
    protected $fillable = [
        'mixer_template_id',
        'ingredient_id',
        'ingredient_option_id',
        'is_required',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(MixerTemplate::class, 'mixer_template_id');
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
