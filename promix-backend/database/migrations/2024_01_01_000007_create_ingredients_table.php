<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->decimal('base_price', 10, 2);
            $table->string('unit')->default('gram');
            $table->decimal('unit_amount', 10, 2);
            $table->integer('stock_quantity')->default(0);
            $table->string('sku')->nullable()->unique();
            $table->json('nutritional_info')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('category_id');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
