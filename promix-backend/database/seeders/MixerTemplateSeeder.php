<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\MixerTemplate;
use Illuminate\Database\Seeder;

class MixerTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Kas Kazanımı Paketi
        $kasKazanimi = MixerTemplate::updateOrCreate(
            ['slug' => 'kas-kazanimi-paketi'],
            [
                'name' => 'Kas Kazanımı Paketi',
                'description' => 'Kas gelişimi için optimize edilmiş protein karışımı. Whey protein, çikolata aroması, BCAA ve kreatin ile güçlendirilmiş.',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ]
        );

        $kasKazanimi->items()->delete();

        $wheyKonsantre = Ingredient::where('slug', 'whey-protein-konsantre')->first();
        $cikolata = Ingredient::where('slug', 'cikolata-aromasi')->first();
        $bcaa = Ingredient::where('slug', 'bcaa')->first();
        $kreatin = Ingredient::where('slug', 'kreatin-monohidrat')->first();

        if ($wheyKonsantre && $cikolata && $bcaa && $kreatin) {
            $kasKazanimi->items()->createMany([
                ['ingredient_id' => $wheyKonsantre->id, 'is_required' => true, 'sort_order' => 1],
                ['ingredient_id' => $cikolata->id, 'is_required' => true, 'sort_order' => 2],
                ['ingredient_id' => $bcaa->id, 'is_required' => false, 'sort_order' => 3],
                ['ingredient_id' => $kreatin->id, 'is_required' => false, 'sort_order' => 4],
            ]);
        }

        // Yağ Yakımı Paketi
        $yagYakimi = MixerTemplate::updateOrCreate(
            ['slug' => 'yag-yakimi-paketi'],
            [
                'name' => 'Yağ Yakımı Paketi',
                'description' => 'Yağ yakımını destekleyen düşük kalorili protein karışımı. İzolat protein, vanilya aroması ve glutamin ile formüle edilmiş.',
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ]
        );

        $yagYakimi->items()->delete();

        $wheyIzolat = Ingredient::where('slug', 'whey-protein-izolat')->first();
        $vanilya = Ingredient::where('slug', 'vanilya-aromasi')->first();
        $glutamin = Ingredient::where('slug', 'glutamin')->first();

        if ($wheyIzolat && $vanilya && $glutamin) {
            $yagYakimi->items()->createMany([
                ['ingredient_id' => $wheyIzolat->id, 'is_required' => true, 'sort_order' => 1],
                ['ingredient_id' => $vanilya->id, 'is_required' => true, 'sort_order' => 2],
                ['ingredient_id' => $glutamin->id, 'is_required' => false, 'sort_order' => 3],
            ]);
        }
    }
}
