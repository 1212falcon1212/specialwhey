<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Protein Bazları',
                'slug' => 'protein-bazlari',
                'description' => 'Whey, İzolat, Kazein ve bitkisel protein çeşitleri',
                'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop&q=80',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Aromalar',
                'slug' => 'aromalar',
                'description' => 'Çikolata, vanilya, çilek ve daha fazla aroma seçeneği',
                'image' => 'https://images.unsplash.com/photo-1659085382780-cd345ba7948d?w=400&h=400&fit=crop&q=80',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Ekstra Bileşenler',
                'slug' => 'ekstra-bilesenler',
                'description' => 'BCAA, glutamin, kreatin ve diğer takviye bileşenler',
                'image' => 'https://images.unsplash.com/photo-1624362772755-4d5843e67047?w=400&h=400&fit=crop&q=80',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Bidonlar',
                'slug' => 'bidonlar',
                'description' => 'Protein shaker ve bidon seçenekleri',
                'image' => 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&q=80',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
