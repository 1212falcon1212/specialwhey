<?php

use App\Http\Controllers\Api\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\IngredientController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\MixerTemplateController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\Admin\RefundController as AdminRefundController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Storefront\AccountController;
use App\Http\Controllers\Api\Storefront\AddressController;
use App\Http\Controllers\Api\Storefront\AuthController;
use App\Http\Controllers\Api\Storefront\BannerController as StorefrontBannerController;
use App\Http\Controllers\Api\Storefront\CategoryController as StorefrontCategoryController;
use App\Http\Controllers\Api\Storefront\CheckoutController;
use App\Http\Controllers\Api\Storefront\FavoriteController;
use App\Http\Controllers\Api\Storefront\IngredientController as StorefrontIngredientController;
use App\Http\Controllers\Api\Storefront\MixerController as StorefrontMixerController;
use App\Http\Controllers\Api\Storefront\OrderController;
use App\Http\Controllers\Api\Storefront\PageController as StorefrontPageController;
use App\Http\Controllers\Api\Storefront\PaytrCallbackController;
use App\Http\Controllers\Api\Storefront\RefundController;
use App\Http\Controllers\Api\Storefront\SavedCardController;
use App\Http\Controllers\Api\Storefront\SearchController as StorefrontSearchController;
use App\Http\Controllers\Api\Storefront\SettingController as StorefrontSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - ProMix
|--------------------------------------------------------------------------
*/

// Auth routes
Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('login', [AuthController::class, 'login'])->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('me', [AuthController::class, 'me'])->name('auth.me');
    });
});

// Public storefront routes
Route::prefix('storefront')->middleware(['throttle:api', 'cache.response:300'])->group(function () {
    Route::get('categories', [StorefrontCategoryController::class, 'index'])->name('storefront.categories');
    Route::get('categories/{slug}', [StorefrontCategoryController::class, 'show'])->name('storefront.categories.show');

    Route::get('ingredients', [StorefrontIngredientController::class, 'index'])->name('storefront.ingredients');
    Route::get('ingredients/featured', [StorefrontIngredientController::class, 'featured'])->name('storefront.ingredients.featured');
    Route::get('ingredients/{slug}', [StorefrontIngredientController::class, 'show'])->name('storefront.ingredients.show');

    Route::get('mixer/templates', [StorefrontMixerController::class, 'templates'])->name('storefront.mixer.templates');
    Route::get('mixer/templates/{slug}', [StorefrontMixerController::class, 'templateShow'])->name('storefront.mixer.templates.show');
    Route::post('mixer/calculate-price', [StorefrontMixerController::class, 'calculatePrice'])->name('storefront.mixer.calculate');

    Route::get('pages/{slug}', [StorefrontPageController::class, 'show'])->name('storefront.pages.show');
    Route::get('banners', [StorefrontBannerController::class, 'index'])->name('storefront.banners');
    Route::get('search', [StorefrontSearchController::class, 'index'])->name('storefront.search')->middleware('throttle:search');
    Route::get('settings/public', [StorefrontSettingController::class, 'index'])->name('storefront.settings');

    Route::get('blog', [\App\Http\Controllers\Api\Storefront\BlogController::class, 'index'])->name('storefront.blog');
    Route::get('blog/{slug}', [\App\Http\Controllers\Api\Storefront\BlogController::class, 'show'])->name('storefront.blog.show');
});

// Auth required storefront routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('account')->group(function () {
        // Profile
        Route::get('profile', [AccountController::class, 'show'])->name('account.profile');
        Route::put('profile', [AccountController::class, 'update'])->name('account.profile.update');
        Route::put('password', [AccountController::class, 'changePassword'])->name('account.password.update');

        // Addresses
        Route::get('addresses', [AddressController::class, 'index'])->name('account.addresses');
        Route::post('addresses', [AddressController::class, 'store'])->name('account.addresses.store');
        Route::put('addresses/{id}', [AddressController::class, 'update'])->name('account.addresses.update');
        Route::delete('addresses/{id}', [AddressController::class, 'destroy'])->name('account.addresses.destroy');

        // Orders
        Route::get('orders', [OrderController::class, 'index'])->name('account.orders');
        Route::get('orders/{orderNumber}', [OrderController::class, 'show'])->name('account.orders.show');

        // Favorites
        Route::get('favorites', [FavoriteController::class, 'index'])->name('account.favorites');
        Route::get('favorites/ids', [FavoriteController::class, 'ids'])->name('account.favorites.ids');
        Route::post('favorites/{ingredientId}/toggle', [FavoriteController::class, 'toggle'])->name('account.favorites.toggle');

        // Saved Cards
        Route::get('saved-cards', [SavedCardController::class, 'index'])->name('account.saved-cards');
        Route::post('saved-cards', [SavedCardController::class, 'store'])->name('account.saved-cards.store');
        Route::delete('saved-cards/{id}', [SavedCardController::class, 'destroy'])->name('account.saved-cards.destroy');
        Route::put('saved-cards/{id}/default', [SavedCardController::class, 'setDefault'])->name('account.saved-cards.default');

        // Refunds
        Route::get('refunds', [RefundController::class, 'index'])->name('account.refunds');
        Route::post('refunds', [RefundController::class, 'store'])->name('account.refunds.store');
        Route::get('refunds/{id}', [RefundController::class, 'show'])->name('account.refunds.show');
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', fn () => response()->json(['success' => true, 'data' => []]))->name('cart.index');
        Route::post('add', fn () => response()->json(['success' => true, 'message' => 'Ürün eklendi']))->name('cart.add');
        Route::put('update', fn () => response()->json(['success' => true, 'message' => 'Sepet güncellendi']))->name('cart.update');
        Route::delete('remove/{id}', fn () => response()->json(['success' => true, 'message' => 'Ürün kaldırıldı']))->name('cart.remove');
        Route::post('apply-coupon', fn () => response()->json(['success' => true, 'message' => 'Kupon uygulandı']))->name('cart.apply-coupon');
        Route::delete('remove-coupon', fn () => response()->json(['success' => true, 'message' => 'Kupon kaldırıldı']))->name('cart.remove-coupon');
    });

    // Checkout
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store')->middleware('throttle:checkout');
});

// PayTR callback (must be public - no auth)
Route::post('paytr/callback', [PaytrCallbackController::class, 'handle'])->name('paytr.callback');

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('admin.dashboard');

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Ingredients
    Route::apiResource('ingredients', IngredientController::class);

    // Mixer Templates
    Route::apiResource('mixer-templates', MixerTemplateController::class);

    // Orders
    Route::get('orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::get('orders/{id}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::put('orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.status');
    Route::put('orders/{id}/payment-status', [AdminOrderController::class, 'updatePaymentStatus'])->name('admin.orders.payment-status');

    // Customers
    Route::get('customers', [AdminCustomerController::class, 'index'])->name('admin.customers.index');
    Route::get('customers/{id}', [AdminCustomerController::class, 'show'])->name('admin.customers.show');

    // Refunds
    Route::get('refunds', [AdminRefundController::class, 'index'])->name('admin.refunds.index');
    Route::get('refunds/{id}', [AdminRefundController::class, 'show'])->name('admin.refunds.show');
    Route::put('refunds/{id}/status', [AdminRefundController::class, 'updateStatus'])->name('admin.refunds.status');

    // Pages
    Route::get('pages', [AdminPageController::class, 'index'])->name('admin.pages.index');
    Route::post('pages', [AdminPageController::class, 'store'])->name('admin.pages.store');
    Route::get('pages/{id}', [AdminPageController::class, 'show'])->name('admin.pages.show');
    Route::put('pages/{id}', [AdminPageController::class, 'update'])->name('admin.pages.update');
    Route::delete('pages/{id}', [AdminPageController::class, 'destroy'])->name('admin.pages.destroy');

    // Banners
    Route::get('banners', [AdminBannerController::class, 'index'])->name('admin.banners.index');
    Route::post('banners', [AdminBannerController::class, 'store'])->name('admin.banners.store');
    Route::get('banners/{id}', [AdminBannerController::class, 'show'])->name('admin.banners.show');
    Route::put('banners/{id}', [AdminBannerController::class, 'update'])->name('admin.banners.update');
    Route::delete('banners/{id}', [AdminBannerController::class, 'destroy'])->name('admin.banners.destroy');

    // Coupons
    Route::get('coupons', [AdminCouponController::class, 'index'])->name('admin.coupons.index');
    Route::post('coupons', [AdminCouponController::class, 'store'])->name('admin.coupons.store');
    Route::get('coupons/{id}', [AdminCouponController::class, 'show'])->name('admin.coupons.show');
    Route::put('coupons/{id}', [AdminCouponController::class, 'update'])->name('admin.coupons.update');
    Route::delete('coupons/{id}', [AdminCouponController::class, 'destroy'])->name('admin.coupons.destroy');

    // Settings
    Route::get('settings', [AdminSettingController::class, 'index'])->name('admin.settings.index');
    Route::put('settings', [AdminSettingController::class, 'update'])->name('admin.settings.update');

    // Blog Posts
    Route::get('blog-posts', [\App\Http\Controllers\Api\Admin\BlogPostController::class, 'index'])->name('admin.blog.index');
    Route::post('blog-posts', [\App\Http\Controllers\Api\Admin\BlogPostController::class, 'store'])->name('admin.blog.store');
    Route::get('blog-posts/{id}', [\App\Http\Controllers\Api\Admin\BlogPostController::class, 'show'])->name('admin.blog.show');
    Route::put('blog-posts/{id}', [\App\Http\Controllers\Api\Admin\BlogPostController::class, 'update'])->name('admin.blog.update');
    Route::delete('blog-posts/{id}', [\App\Http\Controllers\Api\Admin\BlogPostController::class, 'destroy'])->name('admin.blog.destroy');

    // Media
    Route::post('media/upload', [MediaController::class, 'upload'])->name('admin.media.upload');
    Route::delete('media/{id}', [MediaController::class, 'destroy'])->name('admin.media.destroy');
});
