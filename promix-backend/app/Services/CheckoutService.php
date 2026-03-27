<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Ingredient;
use App\Models\IngredientOption;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CheckoutService
{
    public function __construct(
        private readonly PaytrService $paytrService
    ) {}

    /**
     * Sepet verilerinden sipariş oluşturur.
     */
    public function createOrder(array $data, User $user): Order
    {
        return DB::transaction(function () use ($data, $user) {
            $orderNumber = 'PM-'.now()->format('ymdHis').'-'.strtoupper(Str::random(4));

            $subtotal = 0;
            $orderItems = [];

            foreach ($data['items'] as $item) {
                if ($item['type'] === 'ingredient') {
                    $ingredient = Ingredient::findOrFail($item['ingredient_id']);
                    $option = isset($item['option_id'])
                        ? IngredientOption::findOrFail($item['option_id'])
                        : null;
                    $price = $option ? (float) $option->price : (float) $ingredient->base_price;

                    $orderItems[] = [
                        'type' => 'ingredient',
                        'ingredient_id' => $ingredient->id,
                        'ingredient_option_id' => $option?->id,
                        'mixer_snapshot' => null,
                        'quantity' => $item['quantity'],
                        'unit_price' => $price,
                        'total_price' => $price * $item['quantity'],
                    ];

                    $subtotal += $price * $item['quantity'];
                } elseif ($item['type'] === 'mixer') {
                    $mixerTotal = 0;
                    $mixerSnapshot = [];

                    foreach ($item['mixer_items'] as $mi) {
                        $ing = Ingredient::findOrFail($mi['ingredient_id']);
                        $opt = isset($mi['option_id'])
                            ? IngredientOption::findOrFail($mi['option_id'])
                            : null;
                        $p = $opt ? (float) $opt->price : (float) $ing->base_price;
                        $mixerTotal += $p;

                        $mixerSnapshot[] = [
                            'ingredient_id' => $ing->id,
                            'ingredient_name' => $ing->name,
                            'option_id' => $opt?->id,
                            'option_label' => $opt?->label,
                            'price' => $p,
                        ];
                    }

                    $orderItems[] = [
                        'type' => 'mixer',
                        'ingredient_id' => null,
                        'ingredient_option_id' => null,
                        'mixer_snapshot' => $mixerSnapshot,
                        'quantity' => $item['quantity'],
                        'unit_price' => $mixerTotal,
                        'total_price' => $mixerTotal * $item['quantity'],
                    ];

                    $subtotal += $mixerTotal * $item['quantity'];
                }
            }

            $discountAmount = 0;
            $couponId = null;

            $total = $subtotal - $discountAmount;

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'status' => OrderStatus::Pending->value,
                'payment_method' => PaymentMethod::KrediKarti->value,
                'payment_status' => PaymentStatus::Pending->value,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'currency' => 'TRY',
                'coupon_id' => $couponId,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($orderItems as $oi) {
                $order->items()->create($oi);
            }

            $order->addresses()->create([
                'type' => 'billing',
                'full_name' => $data['billing_address']['full_name'],
                'phone' => $data['billing_address']['phone'],
                'city' => $data['billing_address']['city'],
                'district' => $data['billing_address']['district'],
                'address_line' => $data['billing_address']['address_line'],
                'zip_code' => $data['billing_address']['zip_code'] ?? null,
            ]);

            if (isset($data['shipping_address'])) {
                $order->addresses()->create([
                    'type' => 'shipping',
                    'full_name' => $data['shipping_address']['full_name'],
                    'phone' => $data['shipping_address']['phone'],
                    'city' => $data['shipping_address']['city'],
                    'district' => $data['shipping_address']['district'],
                    'address_line' => $data['shipping_address']['address_line'],
                    'zip_code' => $data['shipping_address']['zip_code'] ?? null,
                ]);
            }

            return $order->load('items', 'billingAddress', 'shippingAddress');
        });
    }

    /**
     * PayTR ödeme sürecini başlatır ve iframe URL'sini döner.
     *
     * @return array{token: string, iframe_url: string}
     */
    public function initiatePayment(Order $order, string $userIp): array
    {
        $order->load('items.ingredient', 'user', 'billingAddress');

        return $this->paytrService->createPaymentToken($order, $userIp);
    }

    /**
     * PayTR callback bildirimini işler.
     *
     * @throws \RuntimeException
     */
    public function handlePaymentCallback(array $data): void
    {
        if (! $this->paytrService->verifyCallback($data)) {
            Log::warning('PayTR hash verification failed', [
                'merchant_oid' => $data['merchant_oid'] ?? null,
            ]);

            throw new \RuntimeException('PayTR hash doğrulaması başarısız');
        }

        $order = Order::where('order_number', $data['merchant_oid'])->firstOrFail();

        // Tekrar işlemeyi engelle
        if ($order->payment_status !== PaymentStatus::Pending) {
            Log::info('PayTR callback duplicate skipped', [
                'merchant_oid' => $data['merchant_oid'],
                'current_status' => $order->payment_status->value,
            ]);

            return;
        }

        if ($data['status'] === 'success') {
            $order->update([
                'payment_status' => PaymentStatus::Success->value,
                'status' => OrderStatus::Paid->value,
            ]);

            $order->payments()->create([
                'payment_method' => PaymentMethod::KrediKarti->value,
                'transaction_id' => $data['merchant_oid'],
                'amount' => $data['total_amount'] / 100,
                'currency' => $data['currency'] ?? 'TRY',
                'status' => PaymentStatus::Success->value,
                'provider_response' => $data,
                'paid_at' => now(),
            ]);

            Log::info('PayTR payment success', [
                'merchant_oid' => $data['merchant_oid'],
                'amount' => $data['total_amount'],
            ]);
        } else {
            $order->update([
                'payment_status' => PaymentStatus::Failed->value,
            ]);

            $order->payments()->create([
                'payment_method' => PaymentMethod::KrediKarti->value,
                'transaction_id' => $data['merchant_oid'],
                'amount' => ($data['payment_amount'] ?? $data['total_amount']) / 100,
                'currency' => $data['currency'] ?? 'TRY',
                'status' => PaymentStatus::Failed->value,
                'provider_response' => $data,
            ]);

            Log::warning('PayTR payment failed', [
                'merchant_oid' => $data['merchant_oid'],
                'reason_code' => $data['failed_reason_code'] ?? null,
                'reason_msg' => $data['failed_reason_msg'] ?? null,
            ]);
        }
    }
}
