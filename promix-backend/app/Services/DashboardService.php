<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\User;

class DashboardService
{
    public function getStats(): array
    {
        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        return [
            'orders' => [
                'total' => Order::count(),
                'today' => Order::where('created_at', '>=', $today)->count(),
                'this_week' => Order::where('created_at', '>=', $thisWeek)->count(),
                'this_month' => Order::where('created_at', '>=', $thisMonth)->count(),
                'pending' => Order::where('status', OrderStatus::Pending)->count(),
            ],
            'revenue' => [
                'total' => (float) Order::where('payment_status', PaymentStatus::Success)->sum('total'),
                'today' => (float) Order::where('payment_status', PaymentStatus::Success)->where('created_at', '>=', $today)->sum('total'),
                'this_week' => (float) Order::where('payment_status', PaymentStatus::Success)->where('created_at', '>=', $thisWeek)->sum('total'),
                'this_month' => (float) Order::where('payment_status', PaymentStatus::Success)->where('created_at', '>=', $thisMonth)->sum('total'),
            ],
            'customers' => [
                'total' => User::customer()->count(),
                'this_month' => User::customer()->where('created_at', '>=', $thisMonth)->count(),
            ],
            'ingredients' => [
                'total' => Ingredient::count(),
                'active' => Ingredient::active()->count(),
                'low_stock' => Ingredient::where('stock_quantity', '<', 10)->count(),
            ],
        ];
    }
}
