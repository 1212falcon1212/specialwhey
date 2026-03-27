<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'hakkimizda'],
            [
                'title' => 'Hakkımızda',
                'content' => '<h2>ProMix Hakkında</h2>
<p>ProMix, sporcuların ve sağlıklı yaşam tutkunlarının ihtiyaçlarına özel, kişiselleştirilmiş protein karışımları sunan yenilikçi bir platformdur.</p>
<p>Misyonumuz, herkesin kendi vücut yapısına ve hedeflerine uygun protein formülünü kolayca oluşturabilmesini sağlamaktır.</p>
<h3>Neden ProMix?</h3>
<ul>
<li>Yüksek kaliteli, sertifikalı hammaddeler</li>
<li>Kişiye özel karışım oluşturma</li>
<li>Şeffaf besin değerleri</li>
<li>Hızlı ve güvenli teslimat</li>
</ul>',
                'meta_title' => 'Hakkımızda | ProMix',
                'meta_description' => 'ProMix hakkında bilgi edinin. Kişiselleştirilmiş protein karışımları ile tanışın.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'iletisim'],
            [
                'title' => 'İletişim',
                'content' => '<h2>Bize Ulaşın</h2>
<p>Sorularınız ve önerileriniz için bize ulaşabilirsiniz.</p>
<p><strong>E-posta:</strong> info@promix.com.tr</p>
<p><strong>Telefon:</strong> +90 212 000 00 00</p>
<p><strong>Adres:</strong> İstanbul, Türkiye</p>
<p><strong>Çalışma Saatleri:</strong> Pazartesi - Cuma, 09:00 - 18:00</p>',
                'meta_title' => 'İletişim | ProMix',
                'meta_description' => 'ProMix ile iletişime geçin. Sorularınız için bize yazın.',
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'sikca-sorulan-sorular'],
            [
                'title' => 'Sıkça Sorulan Sorular',
                'content' => '<h2>Sıkça Sorulan Sorular</h2>
<h3>Sipariş ve Teslimat</h3>
<p><strong>S: Siparişim ne zaman kargoya verilir?</strong></p>
<p>C: Ödeme onayından sonra 1-2 iş günü içinde kargoya verilir.</p>
<p><strong>S: Kargo ücreti ne kadar?</strong></p>
<p>C: 500 TL üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde 29.90 TL kargo ücreti uygulanır.</p>
<h3>Ürünler</h3>
<p><strong>S: Ürünlerin son kullanma tarihi nedir?</strong></p>
<p>C: Tüm ürünlerimizin son kullanma tarihi en az 6 ay ileridedir.</p>
<p><strong>S: Kendi karışımımı nasıl oluştururum?</strong></p>
<p>C: "Proteinini Oluştur" sayfasından adım adım protein bazınızı, aromanızı ve ekstra bileşenlerinizi seçerek kendi karışımınızı oluşturabilirsiniz.</p>
<h3>Ödeme</h3>
<p><strong>S: Hangi ödeme yöntemlerini kabul ediyorsunuz?</strong></p>
<p>C: Şu an havale/EFT ile ödeme kabul ediyoruz.</p>',
                'meta_title' => 'SSS | ProMix',
                'meta_description' => 'ProMix hakkında sıkça sorulan sorular ve cevapları.',
                'is_active' => true,
                'sort_order' => 3,
            ]
        );
    }
}
