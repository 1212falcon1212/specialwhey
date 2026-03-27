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

        Page::updateOrCreate(
            ['slug' => 'kargo-takip'],
            [
                'title' => 'Kargo Takip',
                'content' => '<h2>Kargo Takip</h2>
<p>Siparişinizin kargo durumunu buradan takip edebilirsiniz.</p>
<h3>Kargo Süreçleri</h3>
<p>Siparişiniz onaylandıktan sonra aynı gün kargoya verilir. Kargo firması tarafından size SMS ve e-posta ile takip numarası gönderilir.</p>
<p>Teslimat süresi 1-3 iş günüdür. 500₺ üzeri siparişlerde kargo ücretsizdir.</p>
<h3>Kargo Takip Linkleri</h3>
<ul>
<li><strong>Yurtiçi Kargo:</strong> yurticikargo.com adresinden takip numaranız ile sorgulayabilirsiniz.</li>
<li><strong>Aras Kargo:</strong> araskargo.com.tr adresinden kargo durumunuzu öğrenebilirsiniz.</li>
</ul>',
                'meta_title' => 'Kargo Takip | Special Whey',
                'meta_description' => 'Special Whey sipariş kargo takip. Siparişinizin durumunu öğrenin.',
                'is_active' => true,
                'sort_order' => 4,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'iade-ve-degisim'],
            [
                'title' => 'İade ve Değişim',
                'content' => '<h2>İade ve Değişim Koşulları</h2>
<p>Müşteri memnuniyeti bizim için önceliktir. Ürünlerimizle ilgili herhangi bir sorun yaşamanız durumunda iade ve değişim hakkınız saklıdır.</p>
<h3>İade Koşulları</h3>
<ul>
<li>Açılmamış ve kullanılmamış ürünlerde 14 gün içinde koşulsuz iade yapılabilir.</li>
<li>Açılmış ürünlerde kalite sorunu tespit edilmesi halinde değişim yapılır.</li>
<li>İade talebinizi info@specialwhey.com adresine e-posta göndererek başlatabilirsiniz.</li>
</ul>
<h3>İade Süreci</h3>
<ol>
<li>İade talebinizi bize bildirin.</li>
<li>Ürünü orijinal ambalajında kargoya verin.</li>
<li>Ürün tarafımıza ulaştıktan sonra 3 iş günü içinde iade işleminiz tamamlanır.</li>
</ol>',
                'meta_title' => 'İade ve Değişim | Special Whey',
                'meta_description' => 'Special Whey iade ve değişim koşulları. 14 gün içinde koşulsuz iade.',
                'is_active' => true,
                'sort_order' => 5,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'gizlilik-politikasi'],
            [
                'title' => 'Gizlilik Politikası',
                'content' => '<h2>Gizlilik Politikası</h2>
<p>Special Whey olarak kişisel verilerinizin korunmasına büyük önem veriyoruz. Bu gizlilik politikası, toplanan verilerin nasıl kullanıldığını açıklar.</p>
<h3>Toplanan Veriler</h3>
<p>Sitemizi kullandığınızda ad, e-posta, telefon, adres gibi kişisel bilgileriniz sipariş sürecinde toplanır.</p>
<h3>Verilerin Kullanımı</h3>
<ul>
<li>Siparişlerinizi işlemek ve teslim etmek</li>
<li>Müşteri desteği sağlamak</li>
<li>Yasal yükümlülükleri yerine getirmek</li>
</ul>
<h3>Veri Güvenliği</h3>
<p>Kişisel verileriniz SSL şifreleme ile korunur ve üçüncü taraflarla paylaşılmaz.</p>
<h3>İletişim</h3>
<p>Gizlilik politikamız hakkında sorularınız için info@specialwhey.com adresinden bize ulaşabilirsiniz.</p>',
                'meta_title' => 'Gizlilik Politikası | Special Whey',
                'meta_description' => 'Special Whey gizlilik politikası. Kişisel verilerinizin korunması hakkında bilgi.',
                'is_active' => true,
                'sort_order' => 6,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'kullanim-kosullari'],
            [
                'title' => 'Kullanım Koşulları',
                'content' => '<h2>Kullanım Koşulları</h2>
<p>Special Whey web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>
<h3>Genel Koşullar</h3>
<ul>
<li>Site içeriği bilgi amaçlıdır ve önceden haber verilmeksizin değiştirilebilir.</li>
<li>Ürün fiyatları ve stok durumu değişiklik gösterebilir.</li>
<li>Siteyi yasalara aykırı amaçlarla kullanmak yasaktır.</li>
</ul>
<h3>Sipariş ve Ödeme</h3>
<p>Sipariş vererek satış sözleşmesini kabul etmiş olursunuz. Ödeme onayından sonra sipariş işleme alınır.</p>
<h3>Fikri Mülkiyet</h3>
<p>Sitedeki tüm içerik, logo, tasarım ve görseller Special Whey\'e aittir ve izinsiz kullanılamaz.</p>
<h3>İletişim</h3>
<p>Kullanım koşulları hakkında sorularınız için info@specialwhey.com adresinden bize ulaşabilirsiniz.</p>',
                'meta_title' => 'Kullanım Koşulları | Special Whey',
                'meta_description' => 'Special Whey kullanım koşulları ve yasal bilgilendirme.',
                'is_active' => true,
                'sort_order' => 7,
            ]
        );
    }
}
