<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mixer_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mixer_template_id')->constrained('mixer_templates')->onDelete('cascade');
            $table->foreignId('ingredient_id')->constrained('ingredients');
            $table->foreignId('ingredient_option_id')->nullable()->constrained('ingredient_options');
            $table->boolean('is_required')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mixer_template_items');
    }
};
