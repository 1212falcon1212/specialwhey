<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaytrService
{
    private string $merchantId;

    private string $merchantKey;

    private string $merchantSalt;

    public function __construct()
    {
        $this->merchantId = config('paytr.merchant_id');
        $this->merchantKey = config('paytr.merchant_key');
        $this->merchantSalt = config('paytr.merchant_salt');
    }

    /**
     * PayTR iFrame için ödeme tokeni oluşturur.
     *
     * @return array{token: string, iframe_url: string}
     *
     * @throws \RuntimeException
     */
    public function createPaymentToken(Order $order, string $userIp): array
    {
        $basket = [];
        foreach ($order->items as $item) {
            $basket[] = [
                $item->type->value === 'mixer'
                    ? 'Özel Karışım'
                    : ($item->ingredient->name ?? 'Ürün'),
                (string) (int) ($item->unit_price * 100),
                (string) $item->quantity,
            ];
        }
        $userBasket = base64_encode(json_encode($basket));

        $merchantOid = $order->order_number;
        $email = $order->user->email;
        $paymentAmount = (int) ($order->total * 100);
        $currency = 'TL';
        $testMode = (string) config('paytr.test_mode');
        $noInstallment = (string) config('paytr.no_installment');
        $maxInstallment = (string) config('paytr.max_installment');

        $hashStr = $this->merchantId.$userIp.$merchantOid.$email
            .$paymentAmount.$userBasket.$noInstallment.$maxInstallment
            .$currency.$testMode;

        $paytrToken = base64_encode(
            hash_hmac('sha256', $hashStr.$this->merchantSalt, $this->merchantKey, true)
        );

        $postData = [
            'merchant_id' => $this->merchantId,
            'user_ip' => $userIp,
            'merchant_oid' => $merchantOid,
            'email' => $email,
            'payment_amount' => $paymentAmount,
            'paytr_token' => $paytrToken,
            'user_basket' => $userBasket,
            'debug_on' => config('paytr.debug_on'),
            'no_installment' => $noInstallment,
            'max_installment' => $maxInstallment,
            'currency' => $currency,
            'test_mode' => $testMode,
            'merchant_ok_url' => config('paytr.ok_url'),
            'merchant_fail_url' => config('paytr.fail_url'),
            'timeout_limit' => config('paytr.timeout_limit'),
            'lang' => 'tr',
            'user_name' => $order->billingAddress?->full_name ?? $order->user->name,
            'user_address' => $order->billingAddress?->address_line ?? 'Adres belirtilmemiş',
            'user_phone' => $order->billingAddress?->phone ?? '',
        ];

        Log::info('PayTR token request', [
            'merchant_oid' => $merchantOid,
            'payment_amount' => $paymentAmount,
        ]);

        $response = Http::asForm()
            ->timeout(30)
            ->post(config('paytr.base_url').'/odeme/api/get-token', $postData);

        $result = $response->json();

        if (! $result || ($result['status'] ?? null) !== 'success') {
            Log::error('PayTR token error', [
                'merchant_oid' => $merchantOid,
                'response' => $result,
            ]);

            throw new \RuntimeException(
                'PayTR token alınamadı: '.($result['reason'] ?? 'Bilinmeyen hata')
            );
        }

        Log::info('PayTR token success', [
            'merchant_oid' => $merchantOid,
        ]);

        return [
            'token' => $result['token'],
            'iframe_url' => config('paytr.base_url').'/odeme/guvenli/'.$result['token'],
        ];
    }

    /**
     * PayTR callback hash doğrulaması yapar.
     */
    public function verifyCallback(array $postData): bool
    {
        $hash = base64_encode(
            hash_hmac(
                'sha256',
                $postData['merchant_oid'].$this->merchantSalt.$postData['status'].$postData['total_amount'],
                $this->merchantKey,
                true
            )
        );

        return hash_equals($hash, $postData['hash']);
    }
}
