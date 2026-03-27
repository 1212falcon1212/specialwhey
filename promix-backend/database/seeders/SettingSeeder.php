<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Special Whey', 'type' => 'string', 'label' => 'Site Adı'],
            ['group' => 'general', 'key' => 'site_description', 'value' => 'Kişiye Özel Protein Paketi', 'type' => 'string', 'label' => 'Site Açıklaması'],
            ['group' => 'general', 'key' => 'site_email', 'value' => 'info@specialwhey.com', 'type' => 'string', 'label' => 'E-posta Adresi'],
            ['group' => 'general', 'key' => 'site_phone', 'value' => '+90 212 000 00 00', 'type' => 'string', 'label' => 'Telefon Numarası'],
            ['group' => 'general', 'key' => 'site_logo', 'value' => '', 'type' => 'image', 'label' => 'Site Logosu'],
            ['group' => 'general', 'key' => 'site_logo_dark', 'value' => '', 'type' => 'image', 'label' => 'Site Logosu (Koyu Arka Plan)'],
            ['group' => 'general', 'key' => 'site_favicon', 'value' => '', 'type' => 'image', 'label' => 'Favicon'],

            // Payment
            ['group' => 'payment', 'key' => 'bank_name', 'value' => 'Ziraat Bankası', 'type' => 'string', 'label' => 'Banka Adı'],
            ['group' => 'payment', 'key' => 'bank_iban', 'value' => 'TR00 0000 0000 0000 0000 0000 00', 'type' => 'string', 'label' => 'IBAN'],
            ['group' => 'payment', 'key' => 'bank_account_holder', 'value' => 'Special Whey Gıda Ltd. Şti.', 'type' => 'string', 'label' => 'Hesap Sahibi'],

            // Shipping
            ['group' => 'shipping', 'key' => 'free_shipping_min_amount', 'value' => '500', 'type' => 'string', 'label' => 'Ücretsiz Kargo Alt Limiti (₺)'],
            ['group' => 'shipping', 'key' => 'shipping_fee', 'value' => '29.90', 'type' => 'string', 'label' => 'Kargo Ücreti (₺)'],

            // Social
            ['group' => 'social', 'key' => 'instagram_url', 'value' => 'https://instagram.com/specialwhey', 'type' => 'string', 'label' => 'Instagram URL'],
            ['group' => 'social', 'key' => 'facebook_url', 'value' => 'https://facebook.com/specialwhey', 'type' => 'string', 'label' => 'Facebook URL'],
            ['group' => 'social', 'key' => 'twitter_url', 'value' => 'https://twitter.com/specialwhey', 'type' => 'string', 'label' => 'X (Twitter) URL'],

            // Storefront
            ['group' => 'storefront', 'key' => 'storefront.top_bar_messages', 'value' => json_encode(['500₺ üzeri ücretsiz kargo', 'Tüm ödemelerde güvenli alışveriş', 'Aynı gün kargo']), 'type' => 'json', 'label' => 'Üst Bar Mesajları'],
            ['group' => 'storefront', 'key' => 'storefront.ticker_messages', 'value' => json_encode(['Hızlı Kargo', 'Güvenli Ödeme', '100.000+ Mutlu Müşteri', 'Doğal İçerikler', '7/24 Destek']), 'type' => 'json', 'label' => 'Kayan Bant Mesajları'],
            ['group' => 'storefront', 'key' => 'storefront.footer_about_text', 'value' => 'Special Whey, kişiye özel protein paketleri sunan yenilikçi bir platformdur. Bileşenlerini sen seç, paketini biz gönderelim.', 'type' => 'string', 'label' => 'Footer Hakkımızda Yazısı'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
