# FAZ 5: Kullanıcı Hesabı & Sipariş Yönetimi - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Müşteri hesap yönetimi (profil, adresler, siparişler, iadeler, favoriler, kayıtlı kartlar), kayıt sayfası ve admin sipariş/müşteri yönetimi implement edilecek.

**Architecture:** Backend'de mevcut Service→Repository→Model pattern takip edilecek. Yeni tablolar (favorites, saved_cards, refund_requests) için migration + model oluşturulacak. Frontend'de hesabım sayfaları Next.js route group layout ile sidebar navigasyonu kullanacak. Admin sayfaları mevcut DataTable pattern'ini takip edecek.

**Tech Stack:** Laravel 11 (PHP), Next.js 15 (TypeScript), Zustand, SWR, shadcn/ui, Tailwind CSS, react-hook-form + zod

---

## Chunk 1: Backend - Yeni Tablolar & Modeller

### Task 1: Migration ve Model - Favorites

Kullanıcıların bileşenleri favorilere eklemesi.

**Files:**
- Create: `promix-backend/database/migrations/2024_01_01_000020_create_favorites_table.php`
- Create: `promix-backend/app/Models/Favorite.php`
- Modify: `promix-backend/app/Models/User.php` (add favorites relation)
- Modify: `promix-backend/app/Models/Ingredient.php` (add favoritedBy relation)

- [ ] **Step 1: Create favorites migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'ingredient_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
```

- [ ] **Step 2: Create Favorite model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'ingredient_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
```

- [ ] **Step 3: Add relations to User and Ingredient models**

User.php - add:
```php
public function favorites(): HasMany
{
    return $this->hasMany(Favorite::class);
}

public function favoriteIngredients(): BelongsToMany
{
    return $this->belongsToMany(Ingredient::class, 'favorites')->withTimestamps();
}
```

Ingredient.php - add:
```php
public function favoritedBy(): BelongsToMany
{
    return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
}
```

---

### Task 2: Migration ve Model - Saved Cards (PayTR token kayıtları)

PayTR'den dönen kart bilgileri (maskelenmiş) saklanır. Gerçek kart bilgisi tutulmaz, sadece PayTR token referansı.

**Files:**
- Create: `promix-backend/database/migrations/2024_01_01_000021_create_saved_cards_table.php`
- Create: `promix-backend/app/Models/SavedCard.php`
- Modify: `promix-backend/app/Models/User.php` (add savedCards relation)

- [ ] **Step 1: Create saved_cards migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('card_label')->comment('Kullanıcının verdiği isim: İş Bankası Kartım');
            $table->string('last_four', 4);
            $table->string('card_brand')->nullable()->comment('Visa, Mastercard, Troy');
            $table->string('card_token')->comment('PayTR ctoken veya referans');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_cards');
    }
};
```

- [ ] **Step 2: Create SavedCard model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedCard extends Model
{
    protected $fillable = [
        'user_id',
        'card_label',
        'last_four',
        'card_brand',
        'card_token',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    protected $hidden = [
        'card_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

- [ ] **Step 3: Add relation to User model**

```php
public function savedCards(): HasMany
{
    return $this->hasMany(SavedCard::class);
}
```

---

### Task 3: Migration ve Model - Refund Requests (İade Talepleri)

**Files:**
- Create: `promix-backend/database/migrations/2024_01_01_000022_create_refund_requests_table.php`
- Create: `promix-backend/app/Models/RefundRequest.php`
- Create: `promix-backend/app/Enums/RefundStatus.php`
- Create: `promix-backend/app/Enums/RefundReason.php`
- Modify: `promix-backend/app/Models/Order.php` (add refundRequests relation)

- [ ] **Step 1: Create RefundStatus enum**

```php
<?php

namespace App\Enums;

enum RefundStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Beklemede',
            self::Approved => 'Onaylandı',
            self::Rejected => 'Reddedildi',
            self::Refunded => 'İade Edildi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'yellow',
            self::Approved => 'blue',
            self::Rejected => 'red',
            self::Refunded => 'green',
        };
    }
}
```

- [ ] **Step 2: Create RefundReason enum**

```php
<?php

namespace App\Enums;

enum RefundReason: string
{
    case Defective = 'defective';
    case WrongProduct = 'wrong_product';
    case NotAsDescribed = 'not_as_described';
    case ChangedMind = 'changed_mind';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Defective => 'Ürün Hasarlı/Kusurlu',
            self::WrongProduct => 'Yanlış Ürün Gönderildi',
            self::NotAsDescribed => 'Ürün Açıklamaya Uygun Değil',
            self::ChangedMind => 'Fikir Değişikliği',
            self::Other => 'Diğer',
        };
    }
}
```

- [ ] **Step 3: Create refund_requests migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refund_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reason')->comment('RefundReason enum');
            $table->text('description')->nullable();
            $table->string('status')->default('pending')->comment('RefundStatus enum');
            $table->decimal('refund_amount', 10, 2);
            $table->text('admin_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refund_requests');
    }
};
```

- [ ] **Step 4: Create RefundRequest model**

```php
<?php

namespace App\Models;

use App\Enums\RefundReason;
use App\Enums\RefundStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefundRequest extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'reason',
        'description',
        'status',
        'refund_amount',
        'admin_notes',
        'resolved_at',
    ];

    protected $casts = [
        'reason' => RefundReason::class,
        'status' => RefundStatus::class,
        'refund_amount' => 'decimal:2',
        'resolved_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', RefundStatus::Pending);
    }
}
```

- [ ] **Step 5: Add refundRequests relation to Order model**

```php
public function refundRequests(): HasMany
{
    return $this->hasMany(RefundRequest::class);
}
```

- [ ] **Step 6: Run migrations**

```bash
cd promix-backend && php artisan migrate
```

---

## Chunk 2: Backend - Account, Address, Favorites, Saved Cards, Refund APIs

### Task 4: Account API (Profil + Şifre)

**Files:**
- Create: `promix-backend/app/Repositories/AccountRepository.php`
- Create: `promix-backend/app/Services/AccountService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/AccountController.php`
- Create: `promix-backend/app/Http/Requests/Storefront/UpdateProfileRequest.php`
- Create: `promix-backend/app/Http/Requests/Storefront/ChangePasswordRequest.php`
- Create: `promix-backend/app/Http/Resources/Storefront/ProfileResource.php`
- Modify: `promix-backend/routes/api.php` (replace account stubs)

- [ ] **Step 1: Create AccountRepository**

```php
<?php

namespace App\Repositories;

use App\Models\User;

class AccountRepository
{
    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }
}
```

- [ ] **Step 2: Create AccountService**

```php
<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\AccountRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AccountService
{
    public function __construct(
        private readonly AccountRepository $accountRepository
    ) {}

    public function getProfile(User $user): User
    {
        return $user->load('addresses');
    }

    public function updateProfile(User $user, array $data): User
    {
        return $this->accountRepository->update($user, $data);
    }

    public function changePassword(User $user, array $data): void
    {
        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mevcut şifre hatalı.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($data['new_password']),
        ]);
    }
}
```

- [ ] **Step 3: Create UpdateProfileRequest**

```php
<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Ad soyad zorunludur.',
            'name.max' => 'Ad soyad en fazla 100 karakter olabilir.',
        ];
    }
}
```

- [ ] **Step 4: Create ChangePasswordRequest**

```php
<?php

namespace App\Http\Requests\Storefront;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Mevcut şifre zorunludur.',
            'new_password.required' => 'Yeni şifre zorunludur.',
            'new_password.min' => 'Yeni şifre en az 8 karakter olmalıdır.',
            'new_password.confirmed' => 'Şifre tekrarı eşleşmiyor.',
        ];
    }
}
```

- [ ] **Step 5: Create ProfileResource**

```php
<?php

namespace App\Http\Resources\Storefront;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role?->value,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
```

- [ ] **Step 6: Create AccountController**

```php
<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\ChangePasswordRequest;
use App\Http\Requests\Storefront\UpdateProfileRequest;
use App\Http\Resources\Storefront\ProfileResource;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AccountService $accountService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $profile = $this->accountService->getProfile($request->user());

        return $this->success(new ProfileResource($profile));
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $profile = $this->accountService->updateProfile(
            $request->user(),
            $request->validated()
        );

        return $this->success(
            new ProfileResource($profile),
            'Profil güncellendi.'
        );
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->accountService->changePassword(
            $request->user(),
            $request->validated()
        );

        return $this->success(null, 'Şifre başarıyla değiştirildi.');
    }
}
```

---

### Task 5: Address CRUD API

**Files:**
- Create: `promix-backend/app/Repositories/AddressRepository.php`
- Create: `promix-backend/app/Services/AddressService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/AddressController.php`
- Create: `promix-backend/app/Http/Requests/Storefront/StoreAddressRequest.php`
- Create: `promix-backend/app/Http/Requests/Storefront/UpdateAddressRequest.php`
- Create: `promix-backend/app/Http/Resources/Storefront/AddressResource.php`

- [ ] **Step 1: Create AddressRepository**

Methods: `getByUser(User)`, `findOrFail(int)`, `create(array)`, `update(Address, array)`, `delete(Address)`, `setDefault(User, Address)`

setDefault: Unset all other defaults for user, then set this one.

- [ ] **Step 2: Create AddressService**

Methods: `getAll(User)`, `create(User, array)`, `update(int, User, array)` (verify ownership), `delete(int, User)` (verify ownership), `setDefault(int, User)`

- [ ] **Step 3: Create StoreAddressRequest + UpdateAddressRequest**

Rules: title (required, max:50), full_name (required, max:100), phone (required, max:20), city (required, max:100), district (required, max:100), neighborhood (nullable, max:100), address_line (required, max:500), zip_code (nullable, max:10), is_default (boolean)

- [ ] **Step 4: Create AddressResource**

Fields: id, title, full_name, phone, city, district, neighborhood, address_line, zip_code, is_default, created_at

- [ ] **Step 5: Create AddressController**

Methods: index, store, update, destroy - all verify user ownership via service layer.

---

### Task 6: Favorites API

**Files:**
- Create: `promix-backend/app/Services/FavoriteService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/FavoriteController.php`
- Create: `promix-backend/app/Http/Resources/Storefront/FavoriteResource.php`

- [ ] **Step 1: Create FavoriteService**

```php
<?php

namespace App\Services;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class FavoriteService
{
    public function getAll(User $user, array $filters): LengthAwarePaginator
    {
        return Favorite::with('ingredient.category', 'ingredient.options')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 12);
    }

    public function toggle(User $user, int $ingredientId): array
    {
        $existing = Favorite::where('user_id', $user->id)
            ->where('ingredient_id', $ingredientId)
            ->first();

        if ($existing) {
            $existing->delete();

            return ['action' => 'removed'];
        }

        Favorite::create([
            'user_id' => $user->id,
            'ingredient_id' => $ingredientId,
        ]);

        return ['action' => 'added'];
    }

    public function isFavorited(User $user, int $ingredientId): bool
    {
        return Favorite::where('user_id', $user->id)
            ->where('ingredient_id', $ingredientId)
            ->exists();
    }

    public function getFavoritedIds(User $user): array
    {
        return Favorite::where('user_id', $user->id)
            ->pluck('ingredient_id')
            ->toArray();
    }
}
```

- [ ] **Step 2: Create FavoriteResource**

Return ingredient data with category and options (reuse storefront IngredientResource pattern).

- [ ] **Step 3: Create FavoriteController**

```php
// index(Request) - paginated favorites list
// toggle(Request, int $ingredientId) - add/remove toggle, return {action: 'added'|'removed'}
// ids(Request) - return array of favorited ingredient IDs (for frontend heart icons)
```

---

### Task 7: Saved Cards API

**Files:**
- Create: `promix-backend/app/Services/SavedCardService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/SavedCardController.php`
- Create: `promix-backend/app/Http/Resources/Storefront/SavedCardResource.php`
- Create: `promix-backend/app/Http/Requests/Storefront/StoreSavedCardRequest.php`

- [ ] **Step 1: Create SavedCardService**

Methods:
- `getAll(User)` - list user's saved cards
- `create(User, array)` - add card (handle is_default: unset others if true)
- `delete(int, User)` - remove card (verify ownership)
- `setDefault(int, User)` - set as default

- [ ] **Step 2: Create StoreSavedCardRequest**

Rules: card_label (required, max:50), last_four (required, digits:4), card_brand (nullable, in:Visa,Mastercard,Troy), card_token (required, string), is_default (boolean)

- [ ] **Step 3: Create SavedCardResource**

Fields: id, card_label, last_four, card_brand, is_default, created_at. **NEVER expose card_token.**

- [ ] **Step 4: Create SavedCardController**

Methods: index, store, destroy, setDefault.

---

### Task 8: Refund Requests API (Customer side)

**Files:**
- Create: `promix-backend/app/Services/RefundService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/RefundController.php`
- Create: `promix-backend/app/Http/Resources/Storefront/RefundRequestResource.php`
- Create: `promix-backend/app/Http/Requests/Storefront/StoreRefundRequest.php`

- [ ] **Step 1: Create RefundService**

Methods:
- `getByUser(User, filters)` - paginated list
- `create(User, array)` - validate order belongs to user, order is delivered/shipped, no existing pending refund for same order. Create with status=pending, refund_amount=order.total
- `show(int, User)` - single refund detail (verify ownership)

- [ ] **Step 2: Create StoreRefundRequest**

Rules: order_id (required, exists:orders), reason (required, in: RefundReason values), description (nullable, max:1000)

- [ ] **Step 3: Create RefundRequestResource**

Fields: id, order (order_number, total, created_at), reason, reason_label, description, status, status_label, refund_amount, admin_notes, resolved_at, created_at

- [ ] **Step 4: Create RefundController**

Methods: index, store, show.

---

### Task 9: Customer Order History API

**Files:**
- Create: `promix-backend/app/Repositories/OrderRepository.php`
- Create: `promix-backend/app/Services/OrderService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Storefront/OrderController.php`
- Note: OrderResource already exists at `app/Http/Resources/Storefront/OrderResource.php` from FAZ 4

- [ ] **Step 1: Create OrderRepository**

Methods:
- `paginateByUser(User, filters)` - with items, billingAddress, shippingAddress; sort by created_at desc
- `findByOrderNumber(string)` - with all relations (items.ingredient, items.option, addresses, payments, refundRequests)

- [ ] **Step 2: Create OrderService**

Methods:
- `getUserOrders(User, filters)` - delegate to repo
- `getUserOrderDetail(string $orderNumber, User)` - verify ownership, return with relations

- [ ] **Step 3: Create Storefront OrderController**

Methods: index(Request), show(string $orderNumber, Request) - both verify user ownership.

---

### Task 10: Routes Güncelleme & Kayıt

**Files:**
- Modify: `promix-backend/routes/api.php`

- [ ] **Step 1: Replace all account stub routes**

```php
use App\Http\Controllers\Api\Storefront\AccountController;
use App\Http\Controllers\Api\Storefront\AddressController as StorefrontAddressController;
use App\Http\Controllers\Api\Storefront\OrderController as StorefrontOrderController;
use App\Http\Controllers\Api\Storefront\FavoriteController;
use App\Http\Controllers\Api\Storefront\SavedCardController;
use App\Http\Controllers\Api\Storefront\RefundController;

// Account section inside auth:sanctum middleware
Route::prefix('account')->group(function () {
    Route::get('profile', [AccountController::class, 'show'])->name('account.profile');
    Route::put('profile', [AccountController::class, 'update'])->name('account.profile.update');
    Route::put('password', [AccountController::class, 'changePassword'])->name('account.password.update');

    Route::get('addresses', [StorefrontAddressController::class, 'index'])->name('account.addresses');
    Route::post('addresses', [StorefrontAddressController::class, 'store'])->name('account.addresses.store');
    Route::put('addresses/{id}', [StorefrontAddressController::class, 'update'])->name('account.addresses.update');
    Route::delete('addresses/{id}', [StorefrontAddressController::class, 'destroy'])->name('account.addresses.destroy');

    Route::get('orders', [StorefrontOrderController::class, 'index'])->name('account.orders');
    Route::get('orders/{orderNumber}', [StorefrontOrderController::class, 'show'])->name('account.orders.show');

    Route::get('favorites', [FavoriteController::class, 'index'])->name('account.favorites');
    Route::post('favorites/{ingredientId}', [FavoriteController::class, 'toggle'])->name('account.favorites.toggle');
    Route::get('favorites/ids', [FavoriteController::class, 'ids'])->name('account.favorites.ids');

    Route::get('saved-cards', [SavedCardController::class, 'index'])->name('account.saved-cards');
    Route::post('saved-cards', [SavedCardController::class, 'store'])->name('account.saved-cards.store');
    Route::delete('saved-cards/{id}', [SavedCardController::class, 'destroy'])->name('account.saved-cards.destroy');
    Route::put('saved-cards/{id}/default', [SavedCardController::class, 'setDefault'])->name('account.saved-cards.default');

    Route::get('refunds', [RefundController::class, 'index'])->name('account.refunds');
    Route::post('refunds', [RefundController::class, 'store'])->name('account.refunds.store');
    Route::get('refunds/{id}', [RefundController::class, 'show'])->name('account.refunds.show');
});
```

NOTE: `favorites/ids` route must come BEFORE `favorites/{ingredientId}` to avoid collision.

- [ ] **Step 2: Run Pint, verify syntax**

```bash
cd promix-backend && ./vendor/bin/pint && php artisan route:list --path=api/account
```

---

## Chunk 3: Backend - Admin Sipariş & Müşteri API

### Task 11: Admin Order Management API

**Files:**
- Create: `promix-backend/app/Repositories/Admin/OrderRepository.php`
- Create: `promix-backend/app/Services/Admin/OrderService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Admin/OrderController.php`
- Create: `promix-backend/app/Http/Resources/Admin/OrderResource.php`
- Create: `promix-backend/app/Http/Resources/Admin/OrderDetailResource.php`
- Create: `promix-backend/app/Http/Requests/Admin/UpdateOrderStatusRequest.php`
- Create: `promix-backend/app/Http/Requests/Admin/UpdatePaymentStatusRequest.php`

- [ ] **Step 1: Create Admin/OrderRepository**

Methods:
- `paginate(filters)` - with user, items count; filter by status, payment_status, search (order_number, user.name, user.email); sort by created_at desc
- `findOrFail(int)` - with user, items.ingredient, items.option, addresses, payments, refundRequests

- [ ] **Step 2: Create Admin/OrderService**

Methods:
- `getAll(filters)` - paginated
- `findOrFail(int)` - full detail
- `updateStatus(int, OrderStatus)` - update order status
- `updatePaymentStatus(int, PaymentStatus)` - update payment status, if success → set order status to 'paid'

- [ ] **Step 3: Create Admin OrderResource + OrderDetailResource**

OrderResource (list): id, order_number, user (id, name, email), status, payment_method, payment_status, total, currency, items_count, created_at

OrderDetailResource (detail): All above + items (with ingredient info), addresses, payments, refund_requests, notes, admin_notes

- [ ] **Step 4: Create UpdateOrderStatusRequest + UpdatePaymentStatusRequest**

Status request: status (required, in: OrderStatus values)
Payment request: payment_status (required, in: PaymentStatus values)

- [ ] **Step 5: Create Admin OrderController**

Methods: index, show, updateStatus, updatePaymentStatus. Replace stub routes.

---

### Task 12: Admin Customer Management API

**Files:**
- Create: `promix-backend/app/Repositories/Admin/CustomerRepository.php`
- Create: `promix-backend/app/Services/Admin/CustomerService.php`
- Create: `promix-backend/app/Http/Controllers/Api/Admin/CustomerController.php`
- Create: `promix-backend/app/Http/Resources/Admin/CustomerResource.php`
- Create: `promix-backend/app/Http/Resources/Admin/CustomerDetailResource.php`

- [ ] **Step 1: Create Admin/CustomerRepository**

Methods:
- `paginate(filters)` - User::customer() scope, withCount orders; filter by search (name, email, phone)
- `findOrFail(int)` - with addresses, orders (latest 10), orders count

- [ ] **Step 2: Create Admin/CustomerService**

Delegate to repository.

- [ ] **Step 3: Create CustomerResource + CustomerDetailResource**

List: id, name, email, phone, orders_count, created_at
Detail: All above + addresses, recent_orders, total_spent (sum of delivered orders)

- [ ] **Step 4: Create Admin CustomerController**

Methods: index, show. Replace stub routes.

---

### Task 13: Admin Refund Management API

**Files:**
- Create: `promix-backend/app/Http/Controllers/Api/Admin/RefundController.php`
- Create: `promix-backend/app/Http/Resources/Admin/RefundRequestResource.php`
- Create: `promix-backend/app/Http/Requests/Admin/UpdateRefundStatusRequest.php`

- [ ] **Step 1: Create Admin RefundController**

Methods:
- index - list all refund requests, paginated, filter by status
- show - single refund with order detail
- updateStatus - approve/reject refund, add admin_notes, set resolved_at

- [ ] **Step 2: Create UpdateRefundStatusRequest**

Rules: status (required, in: approved,rejected,refunded), admin_notes (nullable, max:1000)

- [ ] **Step 3: Update routes**

Add to admin group:
```php
Route::get('refunds', [AdminRefundController::class, 'index']);
Route::get('refunds/{id}', [AdminRefundController::class, 'show']);
Route::put('refunds/{id}/status', [AdminRefundController::class, 'updateStatus']);
```

- [ ] **Step 4: Replace all remaining admin stub routes**

Replace admin orders, customers stubs with real controllers.

- [ ] **Step 5: Run full backend verification**

```bash
cd promix-backend && ./vendor/bin/pint --test && php artisan route:list --path=api
```

---

## Chunk 4: Frontend - Kayıt & Hesabım Layout

### Task 14: Kayıt (Register) Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/kayit/page.tsx`
- Create: `promix-frontend/src/components/storefront/auth/register-page.tsx`

- [ ] **Step 1: Create register page route**

Server component with metadata: title "Kayıt Ol | ProMix"

- [ ] **Step 2: Create register-page component**

"use client" - Form with: name, email, phone, password, password_confirmation. Use react-hook-form + zod. POST to /auth/register via auth lib. On success: setAuth in store, redirect to /. If already authenticated: redirect to /hesabim. Link to /giris for existing users.

---

### Task 15: Hesabım Layout & Navigation

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/layout.tsx`
- Create: `promix-frontend/src/app/(storefront)/hesabim/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/account-sidebar.tsx`

- [ ] **Step 1: Create account sidebar component**

"use client" - Vertical navigation:
- Profilim (/hesabim/profil)
- Siparişlerim (/hesabim/siparislerim)
- Adreslerim (/hesabim/adreslerim)
- Favorilerim (/hesabim/favorilerim)
- Kayıtlı Kartlarım (/hesabim/kartlarim)
- İadelerim (/hesabim/iadelerim)
- Çıkış (logout action)

Active state: emerald highlight like admin sidebar. Mobile: horizontal scroll tabs or sheet.

- [ ] **Step 2: Create hesabım layout**

"use client" - Check auth (redirect to /giris if not authenticated after hydration). Two-column: sidebar (account-sidebar) + content area. Mobile: tabs at top + content below.

- [ ] **Step 3: Create hesabım index page**

Redirect to /hesabim/profil or show dashboard summary (son siparişler, favori sayısı, adres sayısı).

---

### Task 16: Profil & Şifre Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/profil/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/profile-form.tsx`
- Create: `promix-frontend/src/components/storefront/account/change-password-form.tsx`

- [ ] **Step 1: Create profile page route**

Server component with metadata.

- [ ] **Step 2: Create profile-form component**

"use client" - Fetch profile from GET /account/profile. Form: name, email (disabled), phone. Submit PUT /account/profile. react-hook-form + zod. Toast on success.

- [ ] **Step 3: Create change-password-form component**

"use client" - Form: current_password, new_password, new_password_confirmation. Submit PUT /account/password. Clear form on success. Toast.

- [ ] **Step 4: Compose page**

Profile page renders both forms in a stack with Card wrappers and headings.

---

## Chunk 5: Frontend - Adresler, Siparişler, Favoriler, Kartlar, İadeler

### Task 17: Adres Yönetimi Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/adreslerim/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/address-list.tsx`
- Create: `promix-frontend/src/components/storefront/account/address-form-dialog.tsx`

- [ ] **Step 1: Create address list component**

"use client" - Fetch GET /account/addresses. Grid of address cards with: title, full_name, phone, full address, default badge. Edit/Delete buttons. "Yeni Adres Ekle" button opens dialog.

- [ ] **Step 2: Create address form dialog**

Dialog with form: title, full_name, phone, city, district, neighborhood, address_line, zip_code, is_default switch. Works for both create (POST) and edit (PUT). react-hook-form + zod. Mutate SWR cache on success.

---

### Task 18: Sipariş Geçmişi & Detay

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/siparislerim/page.tsx`
- Create: `promix-frontend/src/app/(storefront)/hesabim/siparislerim/[orderNumber]/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/order-list.tsx`
- Create: `promix-frontend/src/components/storefront/account/order-detail.tsx`
- Create: `promix-frontend/src/components/storefront/account/order-status-badge.tsx`

- [ ] **Step 1: Create order-status-badge component**

Shared badge using ORDER_STATUS_LABELS and ORDER_STATUS_COLORS from constants.

- [ ] **Step 2: Create order-list component**

"use client" - Fetch GET /account/orders with pagination. Table/cards: order_number, date, total, status badge, payment status. Click → /hesabim/siparislerim/{orderNumber}. Empty state.

- [ ] **Step 3: Create order-detail component**

"use client" - Fetch GET /account/orders/{orderNumber}. Show: order info, status timeline, items table (with mixer snapshot display), addresses, payment info. "İade Talebi Oluştur" button (only if status is delivered/shipped).

---

### Task 19: Favorilerim Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/favorilerim/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/favorites-list.tsx`

- [ ] **Step 1: Create favorites-list component**

"use client" - Fetch GET /account/favorites with pagination. Reuse product-card or similar grid. Each card has heart icon (filled), click to remove (POST toggle). Empty state: "Henüz favori ürününüz yok." + "Ürünlere Göz At" link.

---

### Task 20: Kayıtlı Kartlarım Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/kartlarim/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/saved-cards-list.tsx`

- [ ] **Step 1: Create saved-cards-list component**

"use client" - Fetch GET /account/saved-cards. Card list: card brand icon, **** **** **** {last_four}, label, default badge. Delete button with confirmation. "Varsayılan Yap" button. Note: Cards are saved during checkout flow, not added manually here. Empty state.

---

### Task 21: İadelerim Sayfası

**Files:**
- Create: `promix-frontend/src/app/(storefront)/hesabim/iadelerim/page.tsx`
- Create: `promix-frontend/src/components/storefront/account/refund-list.tsx`
- Create: `promix-frontend/src/components/storefront/account/refund-request-dialog.tsx`
- Create: `promix-frontend/src/components/storefront/account/refund-status-badge.tsx`

- [ ] **Step 1: Create refund-status-badge**

Badge with RefundStatus colors (pending=yellow, approved=blue, rejected=red, refunded=green).

- [ ] **Step 2: Create refund-list component**

"use client" - Fetch GET /account/refunds. Table: sipariş no, tarih, tutar, sebep, durum badge, admin notu. Empty state.

- [ ] **Step 3: Create refund-request-dialog**

Dialog opened from order detail page. Form: reason (select from RefundReason options), description (textarea). POST to /account/refunds. Toast on success.

---

### Task 22: Frontend Types & Constants Güncelleme

**Files:**
- Modify: `promix-frontend/src/types/index.ts` (add new type exports)
- Modify: `promix-frontend/src/lib/constants.ts` (add refund status labels/colors)

- [ ] **Step 1: Add types**

Add to types/index.ts or create new files:
- `SavedCard { id, card_label, last_four, card_brand, is_default, created_at }`
- `RefundRequest { id, order_id, order?: { order_number, total, created_at }, reason, reason_label, description, status, status_label, refund_amount, admin_notes, resolved_at, created_at }`
- `RefundStatus = 'pending' | 'approved' | 'rejected' | 'refunded'`
- `RefundReason = 'defective' | 'wrong_product' | 'not_as_described' | 'changed_mind' | 'other'`

- [ ] **Step 2: Add constants**

```typescript
export const REFUND_STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  refunded: 'İade Edildi',
};

export const REFUND_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-green-100 text-green-800',
};

export const REFUND_REASON_LABELS: Record<string, string> = {
  defective: 'Ürün Hasarlı/Kusurlu',
  wrong_product: 'Yanlış Ürün Gönderildi',
  not_as_described: 'Ürün Açıklamaya Uygun Değil',
  changed_mind: 'Fikir Değişikliği',
  other: 'Diğer',
};
```

---

## Chunk 6: Frontend - Admin Sipariş & Müşteri Sayfaları

### Task 23: Admin Sipariş Listesi

**Files:**
- Create: `promix-frontend/src/app/(admin)/admin/siparisler/page.tsx`
- Create: `promix-frontend/src/components/admin/orders/order-list-page.tsx`

- [ ] **Step 1: Create order list page**

"use client" - Fetch GET /admin/orders with pagination + filters. Reuse DataTable pattern. Columns: sipariş no, müşteri, durum (badge), ödeme durumu, toplam, tarih. Filter by status, search by order_number/customer name. Click row → /admin/siparisler/{id}.

---

### Task 24: Admin Sipariş Detay

**Files:**
- Create: `promix-frontend/src/app/(admin)/admin/siparisler/[id]/page.tsx`
- Create: `promix-frontend/src/components/admin/orders/order-detail-page.tsx`
- Create: `promix-frontend/src/components/admin/orders/order-status-update.tsx`

- [ ] **Step 1: Create order detail page**

"use client" - Fetch GET /admin/orders/{id}. Sections: sipariş bilgileri, müşteri bilgileri, ürünler tablosu (ingredient + mixer items), adresler (billing/shipping), ödemeler, iade talepleri.

- [ ] **Step 2: Create order status update component**

Select dropdowns for: order status (PUT /admin/orders/{id}/status), payment status (PUT /admin/orders/{id}/payment-status). Confirm dialog before status change. Toast on success. Mutate SWR.

---

### Task 25: Admin Müşteri Sayfaları

**Files:**
- Create: `promix-frontend/src/app/(admin)/admin/musteriler/page.tsx`
- Create: `promix-frontend/src/app/(admin)/admin/musteriler/[id]/page.tsx`
- Create: `promix-frontend/src/components/admin/customers/customer-list-page.tsx`
- Create: `promix-frontend/src/components/admin/customers/customer-detail-page.tsx`

- [ ] **Step 1: Create customer list page**

"use client" - Fetch GET /admin/customers with pagination + search. DataTable: ad, email, telefon, sipariş sayısı, kayıt tarihi. Click → /admin/musteriler/{id}.

- [ ] **Step 2: Create customer detail page**

"use client" - Fetch GET /admin/customers/{id}. Sections: profil bilgileri, adresler listesi, son siparişler (link to order detail), toplam harcama.

---

### Task 26: Admin İade Yönetimi

**Files:**
- Create: `promix-frontend/src/app/(admin)/admin/iadeler/page.tsx`
- Create: `promix-frontend/src/app/(admin)/admin/iadeler/[id]/page.tsx`
- Create: `promix-frontend/src/components/admin/refunds/refund-list-page.tsx`
- Create: `promix-frontend/src/components/admin/refunds/refund-detail-page.tsx`

- [ ] **Step 1: Create refund list page**

"use client" - Fetch GET /admin/refunds. DataTable: sipariş no, müşteri, sebep, tutar, durum badge, tarih. Filter by status.

- [ ] **Step 2: Create refund detail page**

"use client" - Show refund info, order summary, customer info. Admin actions: approve/reject/refund buttons, admin_notes textarea. PUT /admin/refunds/{id}/status.

- [ ] **Step 3: Update admin layout navigation**

Add to adminNavItems in `src/app/(admin)/layout.tsx`:
```typescript
{ href: "/admin/iadeler", label: "İade Talepleri" },
```

---

## Chunk 7: Verification & Final Touches

### Task 27: Backend Verification

- [ ] **Step 1: Run Pint**
```bash
cd promix-backend && ./vendor/bin/pint --test
```

- [ ] **Step 2: Check routes**
```bash
php artisan route:list --path=api
```

- [ ] **Step 3: Check migrations**
```bash
php artisan migrate:fresh --seed
```

### Task 28: Frontend Verification

- [ ] **Step 1: TypeScript check**
```bash
cd promix-frontend && npx tsc --noEmit
```

- [ ] **Step 2: Build check**
```bash
npm run build
```

---

## File Count Summary

| Layer | New | Modified |
|-------|-----|----------|
| Backend Migrations | 3 | 0 |
| Backend Models | 3 | 3 |
| Backend Enums | 2 | 0 |
| Backend Repositories | 4 | 0 |
| Backend Services | 7 | 0 |
| Backend Controllers | 9 | 0 |
| Backend Resources | 9 | 0 |
| Backend Requests | 7 | 0 |
| Backend Routes | 0 | 1 |
| Frontend Pages | ~14 | 0 |
| Frontend Components | ~20 | 0 |
| Frontend Types/Constants | 0 | 2 |
| Frontend Layout | 0 | 1 |
| **Toplam** | **~78** | **~7** |
