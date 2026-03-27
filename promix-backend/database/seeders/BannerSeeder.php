<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            // Hero banners - gym & fitness
            [
                'title' => 'Kişiselleştirilmiş Protein Karışımları',
                'subtitle' => 'Kendi formülünü oluştur, hedeflerine ulaş',
                'image' => 'https://images.unsplash.com/photo-1585484764802-387ea30e8432?w=1200&h=500&fit=crop&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1585484764802-387ea30e8432?w=600&h=400&fit=crop&q=80',
                'link' => '/proteinini-olustur',
                'button_text' => 'Hemen Başla',
                'position' => 'hero',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Yaz İndirimleri Başladı',
                'subtitle' => 'Seçili ürünlerde %30\'a varan indirimler',
                'image' => 'https://images.unsplash.com/photo-1584827386894-fc939dad6078?w=1200&h=500&fit=crop&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1584827386894-fc939dad6078?w=600&h=400&fit=crop&q=80',
                'link' => '/urunler',
                'button_text' => 'Alışverişe Başla',
                'position' => 'hero',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => '500₺ Üzeri Ücretsiz Kargo',
                'subtitle' => 'Tüm Türkiye\'ye hızlı teslimat',
                'image' => 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=1200&h=500&fit=crop&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=600&h=400&fit=crop&q=80',
                'link' => '/urunler',
                'button_text' => 'Keşfet',
                'position' => 'hero',
                'is_active' => true,
                'sort_order' => 2,
            ],
            // Sidebar banners - protein & supplements
            [
                'title' => 'Whey Protein',
                'subtitle' => 'En çok tercih edilen',
                'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop&q=80',
                'link' => '/urunler?kategori=protein-bazlari',
                'button_text' => 'İncele',
                'position' => 'sidebar',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'BCAA & Amino',
                'subtitle' => 'Kas gelişimini destekle',
                'image' => 'https://images.unsplash.com/photo-1606940743881-b33f4b04d661?w=400&h=300&fit=crop&q=80',
                'link' => '/urunler?kategori=ekstra-bilesenler',
                'button_text' => 'İncele',
                'position' => 'sidebar',
                'is_active' => true,
                'sort_order' => 1,
            ],
            // Category promo banners
            [
                'title' => 'Protein Tozları',
                'subtitle' => 'Geniş ürün yelpazesi',
                'image' => 'https://images.unsplash.com/photo-1680265158261-5fd6ba5d9959?w=600&h=450&fit=crop&q=80',
                'link' => '/urunler?kategori=protein-bazlari',
                'button_text' => 'Alışverişe Başla',
                'position' => 'category_promo',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Kreatin & Performans',
                'subtitle' => 'Performansını artır',
                'image' => 'https://images.unsplash.com/photo-1589579234091-4b2ffe39b26f?w=600&h=450&fit=crop&q=80',
                'link' => '/urunler?kategori=ekstra-bilesenler',
                'button_text' => 'Alışverişe Başla',
                'position' => 'category_promo',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Aromalar & Lezzetler',
                'subtitle' => 'Karışımına tat katmanın yolu',
                'image' => 'https://images.unsplash.com/photo-1628515186648-3ab6ce3e8a2a?w=600&h=450&fit=crop&q=80',
                'link' => '/urunler?kategori=aromalar',
                'button_text' => 'Alışverişe Başla',
                'position' => 'category_promo',
                'is_active' => true,
                'sort_order' => 2,
            ],
            // Fullwidth promo banner - fitness lifestyle
            [
                'title' => 'Proteinini Kendin Oluştur',
                'subtitle' => 'Tamamen sana özel protein formülü. İhtiyacına göre bileşenlerini seç, karışımını oluştur.',
                'image' => 'https://images.unsplash.com/photo-1690731069562-6c6fbcd47353?w=1400&h=400&fit=crop&q=80',
                'link' => '/proteinini-olustur',
                'button_text' => 'Hemen Dene',
                'position' => 'fullwidth_promo',
                'is_active' => true,
                'sort_order' => 0,
            ],
            // Lifestyle gallery banners (5 adet)
            [
                'title' => 'Güçlü Başla, Güçlü Kal',
                'subtitle' => 'Antrenman öncesi ve sonrası doğru beslenme ile farkı hisset.',
                'image' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop&q=80',
                'link' => '/proteinini-olustur',
                'button_text' => null,
                'position' => 'lifestyle',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Doğal Bileşenler',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=750&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'lifestyle',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Performans Odaklı',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=750&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'lifestyle',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Sağlıklı Yaşam',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=750&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'lifestyle',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Hedefine Ulaş',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=750&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'lifestyle',
                'is_active' => true,
                'sort_order' => 4,
            ],
            // Process banners (3 adet - how it works arka planları)
            [
                'title' => 'Bileşen Seçimi',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50c?w=800&h=600&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'process',
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Laboratuvar Üretimi',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'process',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Kargo Teslimat',
                'subtitle' => null,
                'image' => 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop&q=80',
                'link' => null,
                'button_text' => null,
                'position' => 'process',
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::updateOrCreate(
                ['title' => $banner['title'], 'position' => $banner['position']],
                $banner
            );
        }
    }
}
