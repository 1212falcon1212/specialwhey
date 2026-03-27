<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $proteinCategory = Category::where('slug', 'protein-bazlari')->first();
        $aromaCategory = Category::where('slug', 'aromalar')->first();
        $ekstraCategory = Category::where('slug', 'ekstra-bilesenler')->first();

        // Protein Bazları
        $wheyKonsantre = Ingredient::updateOrCreate(
            ['slug' => 'whey-protein-konsantre'],
            [
                'category_id' => $proteinCategory->id,
                'name' => 'Whey Protein Konsantre',
                'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop&q=80',
                'description' => 'Yüksek kaliteli süt kaynaklı whey protein konsantre. Kas gelişimi ve toparlanma için ideal protein kaynağı.',
                'short_description' => 'Klasik whey protein, uygun fiyatlı kas yapıcı',
                'base_price' => 299.90,
                'unit' => 'gram',
                'unit_amount' => 1000,
                'stock_quantity' => 100,
                'sku' => 'PRO-WPC-001',
                'nutritional_info' => [
                    'calories' => 120,
                    'protein' => 24,
                    'carbs' => 3,
                    'fat' => 1.5,
                    'fiber' => 0,
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ]
        );

        $wheyKonsantre->options()->delete();
        $wheyKonsantre->options()->createMany([
            ['label' => '250g', 'amount' => 250, 'price' => 99.90, 'stock_quantity' => 100, 'is_default' => false, 'sort_order' => 1],
            ['label' => '500g', 'amount' => 500, 'price' => 179.90, 'stock_quantity' => 100, 'is_default' => false, 'sort_order' => 2],
            ['label' => '1000g', 'amount' => 1000, 'price' => 299.90, 'stock_quantity' => 100, 'is_default' => true, 'sort_order' => 3],
        ]);

        $wheyIzolat = Ingredient::updateOrCreate(
            ['slug' => 'whey-protein-izolat'],
            [
                'category_id' => $proteinCategory->id,
                'name' => 'Whey Protein İzolat',
                'image' => 'https://images.unsplash.com/photo-1680265158261-5fd6ba5d9959?w=500&h=500&fit=crop&q=80',
                'description' => 'Saf whey protein izolat. Düşük yağ ve karbonhidrat içeriği ile maksimum protein.',
                'short_description' => 'Saf izolat protein, düşük yağ ve karbonhidrat',
                'base_price' => 449.90,
                'unit' => 'gram',
                'unit_amount' => 1000,
                'stock_quantity' => 100,
                'sku' => 'PRO-WPI-001',
                'nutritional_info' => [
                    'calories' => 110,
                    'protein' => 27,
                    'carbs' => 1,
                    'fat' => 0.5,
                    'fiber' => 0,
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ]
        );

        $wheyIzolat->options()->delete();
        $wheyIzolat->options()->createMany([
            ['label' => '250g', 'amount' => 250, 'price' => 149.90, 'stock_quantity' => 100, 'is_default' => false, 'sort_order' => 1],
            ['label' => '500g', 'amount' => 500, 'price' => 269.90, 'stock_quantity' => 100, 'is_default' => false, 'sort_order' => 2],
            ['label' => '1000g', 'amount' => 1000, 'price' => 449.90, 'stock_quantity' => 100, 'is_default' => true, 'sort_order' => 3],
        ]);

        $kazein = Ingredient::updateOrCreate(
            ['slug' => 'kazein-protein'],
            [
                'category_id' => $proteinCategory->id,
                'name' => 'Kazein Protein',
                'image' => 'https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?w=500&h=500&fit=crop&q=80',
                'description' => 'Yavaş salınımlı kazein protein. Uzun süreli amino asit salınımı için idealdir.',
                'short_description' => 'Yavaş salınımlı protein, gece kullanımı için ideal',
                'base_price' => 399.90,
                'unit' => 'gram',
                'unit_amount' => 1000,
                'stock_quantity' => 100,
                'sku' => 'PRO-CAS-001',
                'nutritional_info' => [
                    'calories' => 115,
                    'protein' => 25,
                    'carbs' => 2,
                    'fat' => 1,
                    'fiber' => 0,
                ],
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 3,
            ]
        );

        $kazein->options()->delete();
        $kazein->options()->createMany([
            ['label' => '500g', 'amount' => 500, 'price' => 229.90, 'stock_quantity' => 100, 'is_default' => false, 'sort_order' => 1],
            ['label' => '1000g', 'amount' => 1000, 'price' => 399.90, 'stock_quantity' => 100, 'is_default' => true, 'sort_order' => 2],
        ]);

        // Aromalar
        $aromalar = [
            [
                'name' => 'Çikolata Aroması',
                'slug' => 'cikolata-aromasi',
                'image' => 'https://images.unsplash.com/photo-1659055939237-bc2be8be2f14?w=500&h=500&fit=crop&q=80',
                'description' => 'Yoğun kakao tadı ile zenginleştirilmiş doğal çikolata aroması.',
                'short_description' => 'Yoğun çikolata lezzeti',
                'sku' => 'ARO-CHO-001',
                'sort_order' => 1,
            ],
            [
                'name' => 'Vanilya Aroması',
                'slug' => 'vanilya-aromasi',
                'image' => 'https://images.unsplash.com/photo-1592788174877-3f99727fd23d?w=500&h=500&fit=crop&q=80',
                'description' => 'Doğal vanilya özü ile hazırlanmış klasik vanilya aroması.',
                'short_description' => 'Klasik vanilya lezzeti',
                'sku' => 'ARO-VAN-001',
                'sort_order' => 2,
            ],
            [
                'name' => 'Çilek Aroması',
                'slug' => 'cilek-aromasi',
                'image' => 'https://images.unsplash.com/photo-1575980541474-bf9e64967d55?w=500&h=500&fit=crop&q=80',
                'description' => 'Taze çilek özü ile hazırlanmış ferah çilek aroması.',
                'short_description' => 'Taze çilek lezzeti',
                'sku' => 'ARO-STR-001',
                'sort_order' => 3,
            ],
        ];

        foreach ($aromalar as $aroma) {
            Ingredient::updateOrCreate(
                ['slug' => $aroma['slug']],
                array_merge($aroma, [
                    'category_id' => $aromaCategory->id,
                    'base_price' => 49.90,
                    'unit' => 'gram',
                    'unit_amount' => 100,
                    'stock_quantity' => 100,
                    'nutritional_info' => ['calories' => 5, 'protein' => 0, 'carbs' => 1, 'fat' => 0],
                    'is_active' => true,
                    'is_featured' => true,
                ])
            );
        }

        // Ekstra Bileşenler
        $ekstralar = [
            [
                'name' => 'BCAA',
                'slug' => 'bcaa',
                'image' => 'https://images.unsplash.com/photo-1606940743881-b33f4b04d661?w=500&h=500&fit=crop&q=80',
                'description' => 'Dallanmış zincirli amino asitler (Lösin, İzolösin, Valin). Kas toparlanmasını destekler.',
                'short_description' => 'Kas toparlanması için amino asit kompleksi',
                'base_price' => 149.90,
                'unit_amount' => 250,
                'sku' => 'EXT-BCA-001',
                'nutritional_info' => ['calories' => 0, 'protein' => 5, 'carbs' => 0, 'fat' => 0],
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Glutamin',
                'slug' => 'glutamin',
                'image' => 'https://images.unsplash.com/photo-1624362772755-4d5843e67047?w=500&h=500&fit=crop&q=80',
                'description' => 'L-Glutamin amino asidi. Bağışıklık sistemi ve kas toparlanmasını destekler.',
                'short_description' => 'Toparlanma ve bağışıklık desteği',
                'base_price' => 129.90,
                'unit_amount' => 250,
                'sku' => 'EXT-GLU-001',
                'nutritional_info' => ['calories' => 0, 'protein' => 5, 'carbs' => 0, 'fat' => 0],
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'Kreatin Monohidrat',
                'slug' => 'kreatin-monohidrat',
                'image' => 'https://images.unsplash.com/photo-1693996045300-521e9d08cabc?w=500&h=500&fit=crop&q=80',
                'description' => 'Saf kreatin monohidrat. Güç ve performans artışı için bilimsel olarak kanıtlanmış takviye.',
                'short_description' => 'Güç ve performans artışı',
                'base_price' => 99.90,
                'unit_amount' => 250,
                'sku' => 'EXT-CRE-001',
                'nutritional_info' => ['calories' => 0, 'protein' => 0, 'carbs' => 0, 'fat' => 0],
                'sort_order' => 3,
                'is_featured' => true,
            ],
        ];

        foreach ($ekstralar as $ekstra) {
            Ingredient::updateOrCreate(
                ['slug' => $ekstra['slug']],
                array_merge($ekstra, [
                    'category_id' => $ekstraCategory->id,
                    'unit' => 'gram',
                    'stock_quantity' => 100,
                    'is_active' => true,
                ])
            );
        }

        // Bidonlar
        $bidonCategory = Category::where('slug', 'bidonlar')->first();
        if (! $bidonCategory) {
            return;
        }

        $bidonlar = [
            [
                'name' => 'ProMix Shaker 600ml',
                'slug' => 'promix-shaker-600ml',
                'image' => 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&h=500&fit=crop&q=80',
                'description' => 'BPA içermeyen, sızdırmaz kapaklı 600ml protein shaker. Karıştırma teli dahildir.',
                'short_description' => 'Klasik shaker, günlük kullanım için ideal',
                'base_price' => 89.90,
                'unit' => 'adet',
                'unit_amount' => 1,
                'stock_quantity' => 200,
                'sku' => 'BDN-SHK-600',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'ProMix Shaker 800ml',
                'slug' => 'promix-shaker-800ml',
                'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=500&h=500&fit=crop&q=80',
                'description' => 'Büyük hacimli 800ml protein shaker. Çift bölmeli saklama alanı ve karıştırma teli ile.',
                'short_description' => 'Büyük boy shaker, ekstra saklama bölmeli',
                'base_price' => 119.90,
                'unit' => 'adet',
                'unit_amount' => 1,
                'stock_quantity' => 150,
                'sku' => 'BDN-SHK-800',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'ProMix Premium Bidon 1000ml',
                'slug' => 'promix-premium-bidon-1000ml',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop&q=80',
                'description' => 'Paslanmaz çelik, çift cidarlı termos bidon. Sıcak ve soğuk içecekler için ideal. 1000ml kapasite.',
                'short_description' => 'Premium termos bidon, paslanmaz çelik',
                'base_price' => 199.90,
                'unit' => 'adet',
                'unit_amount' => 1,
                'stock_quantity' => 100,
                'sku' => 'BDN-PRM-1000',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($bidonlar as $bidon) {
            Ingredient::updateOrCreate(
                ['slug' => $bidon['slug']],
                array_merge($bidon, [
                    'category_id' => $bidonCategory->id,
                    'nutritional_info' => null,
                ])
            );
        }
    }
}
