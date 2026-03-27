<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', UserRole::Admin)->first();
        if (! $admin) {
            return;
        }

        $posts = [
            [
                'title' => 'Protein Tozu Nasıl Seçilir?',
                'slug' => 'protein-tozu-nasil-secilir',
                'excerpt' => 'Doğru protein tozunu seçmek, fitness hedeflerinize ulaşmanızda kritik bir adımdır. Bu rehberde sizin için en uygun protein tozunu nasıl seçeceğinizi anlatıyoruz.',
                'content' => '<h2>Protein Tozu Seçerken Dikkat Edilmesi Gerekenler</h2><p>Protein tozu seçimi, fitness hedeflerinize, bütçenize ve diyet tercihlerinize bağlı olarak değişir. İşte dikkat etmeniz gereken temel noktalar:</p><h3>1. Protein Kaynağı</h3><p>Whey protein en popüler seçenek olsa da, kazein, soya, bezelye ve pirinç proteini gibi alternatifler de mevcuttur.</p><h3>2. Protein Oranı</h3><p>Kaliteli bir protein tozunda en az %70 protein oranı aranmalıdır. İzolat formları genellikle %90 ve üzeri protein içerir.</p><h3>3. Katkı Maddeleri</h3><p>Yapay tatlandırıcılar, koruyucular ve dolgu maddeleri içermeyen ürünleri tercih edin.</p>',
                'image' => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&h=450&fit=crop&q=80',
                'author_id' => $admin->id,
                'is_published' => true,
                'published_at' => now()->subDays(10),
                'meta_title' => 'Protein Tozu Nasıl Seçilir? | ProMix Blog',
                'meta_description' => 'Doğru protein tozunu seçmek için bilmeniz gereken her şey. Whey, kazein, izolat karşılaştırması.',
            ],
            [
                'title' => 'Antrenman Öncesi ve Sonrası Beslenme',
                'slug' => 'antrenman-oncesi-sonrasi-beslenme',
                'excerpt' => 'Antrenman öncesi ve sonrası doğru beslenme, performansınızı ve toparlanmanızı doğrudan etkiler.',
                'content' => '<h2>Antrenman Öncesi Beslenme</h2><p>Antrenman öncesi 1-2 saat içinde kompleks karbonhidrat ve protein içeren bir öğün tüketmek, enerji seviyenizi yüksek tutar.</p><h2>Antrenman Sonrası Beslenme</h2><p>Antrenman sonrası 30-60 dakika içinde protein ve karbonhidrat alımı, kas onarımını hızlandırır. Bu dönemde whey protein shake ideal bir seçenektir.</p>',
                'image' => 'https://images.unsplash.com/photo-1585484764802-387ea30e8432?w=800&h=450&fit=crop&q=80',
                'author_id' => $admin->id,
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'meta_title' => 'Antrenman Öncesi ve Sonrası Beslenme | ProMix Blog',
                'meta_description' => 'Antrenman öncesi ve sonrası beslenme rehberi. Performansınızı artırın.',
            ],
            [
                'title' => 'BCAA Nedir ve Ne İşe Yarar?',
                'slug' => 'bcaa-nedir-ne-ise-yarar',
                'excerpt' => 'BCAA (Dallı Zincirli Amino Asitler) kas gelişimi ve toparlanma için önemli takviyelerden biridir.',
                'content' => '<h2>BCAA Nedir?</h2><p>BCAA, lösin, izolösin ve valin olmak üzere üç temel amino asitten oluşur. Vücut tarafından üretilemeyen bu amino asitler, dışarıdan alınmalıdır.</p><h2>BCAA\'nın Faydaları</h2><ul><li>Kas protein sentezini artırır</li><li>Egzersiz sonrası kas ağrısını azaltır</li><li>Kas yıkımını önler</li><li>Egzersiz sırasında yorgunluğu azaltır</li></ul>',
                'image' => 'https://images.unsplash.com/photo-1606940743881-b33f4b04d661?w=800&h=450&fit=crop&q=80',
                'author_id' => $admin->id,
                'is_published' => true,
                'published_at' => now()->subDays(3),
                'meta_title' => 'BCAA Nedir ve Ne İşe Yarar? | ProMix Blog',
                'meta_description' => 'BCAA hakkında bilmeniz gereken her şey. Faydaları, kullanımı ve dozaj rehberi.',
            ],
            [
                'title' => 'Kişiselleştirilmiş Protein Karışımlarının Avantajları',
                'slug' => 'kisisellestirilmis-protein-karisimlarinin-avantajlari',
                'excerpt' => 'Hazır ürünler yerine kendi protein karışımınızı oluşturmanın avantajlarını keşfedin.',
                'content' => '<h2>Neden Kişiselleştirilmiş Protein?</h2><p>Her bireyin protein ihtiyacı farklıdır. Vücut tipi, antrenman yoğunluğu ve hedefler göz önüne alındığında, tek bir formülün herkese uyması mümkün değildir.</p><h2>ProMix ile Fark</h2><p>ProMix platformunda kendi protein karışımınızı oluşturabilirsiniz. Protein bazınızı, aromanızı ve ekstra bileşenlerinizi seçerek tamamen size özel bir formül elde edersiniz.</p>',
                'image' => 'https://images.unsplash.com/photo-1606858274001-dd10efc5ce7d?w=800&h=450&fit=crop&q=80',
                'author_id' => $admin->id,
                'is_published' => true,
                'published_at' => now()->subDays(1),
                'meta_title' => 'Kişiselleştirilmiş Protein Karışımları | ProMix Blog',
                'meta_description' => 'Kendi protein karışımınızı oluşturmanın avantajları. ProMix ile farkı keşfedin.',
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
