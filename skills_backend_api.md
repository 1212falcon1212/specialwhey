# Skill: Laravel API Geliştirme - ProMix

## Bu Skill Ne Zaman Kullanılır?
Backend'de yeni endpoint, controller, service, model veya migration oluştururken.

---

## Controller Oluşturma Şablonu

Controller sadece orchestration yapar, iş mantığı Service'dedir:

```php
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreIngredientRequest;
use App\Http\Requests\Admin\UpdateIngredientRequest;
use App\Http\Resources\Admin\IngredientResource;
use App\Services\IngredientService;
use Illuminate\Http\JsonResponse;

class IngredientController extends Controller
{
    public function __construct(
        private readonly IngredientService $ingredientService
    ) {}

    public function index(): JsonResponse
    {
        $ingredients = $this->ingredientService->getAll(request()->all());

        return response()->json([
            'success' => true,
            'data' => IngredientResource::collection($ingredients),
            'meta' => [
                'current_page' => $ingredients->currentPage(),
                'last_page' => $ingredients->lastPage(),
                'per_page' => $ingredients->perPage(),
                'total' => $ingredients->total(),
            ],
        ]);
    }

    public function store(StoreIngredientRequest $request): JsonResponse
    {
        $ingredient = $this->ingredientService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new IngredientResource($ingredient),
            'message' => 'Bileşen başarıyla oluşturuldu.',
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $ingredient = $this->ingredientService->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new IngredientResource($ingredient),
        ]);
    }

    public function update(UpdateIngredientRequest $request, int $id): JsonResponse
    {
        $ingredient = $this->ingredientService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new IngredientResource($ingredient),
            'message' => 'Bileşen başarıyla güncellendi.',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->ingredientService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Bileşen başarıyla silindi.',
        ]);
    }
}
```

## Service Şablonu

```php
<?php

namespace App\Services;

use App\Repositories\IngredientRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Ingredient;

class IngredientService
{
    public function __construct(
        private readonly IngredientRepository $ingredientRepository
    ) {}

    public function getAll(array $filters): LengthAwarePaginator
    {
        return $this->ingredientRepository->paginate($filters);
    }

    public function findOrFail(int $id): Ingredient
    {
        return $this->ingredientRepository->findOrFail($id);
    }

    public function create(array $data): Ingredient
    {
        // İş mantığı burada
        $ingredient = $this->ingredientRepository->create($data);

        // Options varsa kaydet
        if (isset($data['options'])) {
            foreach ($data['options'] as $option) {
                $ingredient->options()->create($option);
            }
        }

        return $ingredient->load('options', 'category');
    }

    public function update(int $id, array $data): Ingredient
    {
        $ingredient = $this->ingredientRepository->findOrFail($id);
        $this->ingredientRepository->update($ingredient, $data);

        if (isset($data['options'])) {
            $ingredient->options()->delete();
            foreach ($data['options'] as $option) {
                $ingredient->options()->create($option);
            }
        }

        return $ingredient->fresh(['options', 'category']);
    }

    public function delete(int $id): void
    {
        $ingredient = $this->ingredientRepository->findOrFail($id);
        $this->ingredientRepository->delete($ingredient);
    }
}
```

## Repository Şablonu

```php
<?php

namespace App\Repositories;

use App\Models\Ingredient;
use Illuminate\Pagination\LengthAwarePaginator;

class IngredientRepository
{
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Ingredient::with('category', 'options');

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? $perPage);
    }

    public function findOrFail(int $id): Ingredient
    {
        return Ingredient::with('category', 'options')->findOrFail($id);
    }

    public function create(array $data): Ingredient
    {
        return Ingredient::create($data);
    }

    public function update(Ingredient $ingredient, array $data): Ingredient
    {
        $ingredient->update($data);
        return $ingredient;
    }

    public function delete(Ingredient $ingredient): void
    {
        $ingredient->delete(); // soft delete
    }
}
```

## Model Şablonu

```php
<?php

namespace App\Models;

use App\Enums\IngredientUnit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Ingredient extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'category_id', 'name', 'slug',
        'description', 'short_description',
        'image', 'gallery',
        'base_price', 'unit', 'unit_amount',
        'stock_quantity', 'sku',
        'nutritional_info',
        'is_active', 'is_featured', 'sort_order',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'gallery' => 'array',
        'nutritional_info' => 'array',
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'unit' => IngredientUnit::class,
    ];

    // İlişkiler
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(IngredientOption::class)->orderBy('sort_order');
    }

    // Meilisearch
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'category_id' => $this->category_id,
            'base_price' => (float) $this->base_price,
            'is_active' => $this->is_active,
        ];
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
```

## FormRequest Şablonu

```php
<?php

namespace App\Http\Requests\Admin;

use App\Enums\IngredientUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIngredientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Admin middleware zaten kontrol ediyor
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:ingredients,slug'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', Rule::enum(IngredientUnit::class)],
            'unit_amount' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'unique:ingredients,sku'],
            'nutritional_info' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'options' => ['nullable', 'array'],
            'options.*.label' => ['required_with:options', 'string', 'max:255'],
            'options.*.amount' => ['required_with:options', 'numeric', 'min:0'],
            'options.*.price' => ['required_with:options', 'numeric', 'min:0'],
            'options.*.stock_quantity' => ['required_with:options', 'integer', 'min:0'],
            'options.*.is_default' => ['boolean'],
            'options.*.sort_order' => ['integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bileşen adı zorunludur.',
            'category_id.required' => 'Kategori seçimi zorunludur.',
            'category_id.exists' => 'Seçilen kategori bulunamadı.',
            'base_price.required' => 'Fiyat zorunludur.',
            'base_price.min' => 'Fiyat 0\'dan küçük olamaz.',
            'slug.unique' => 'Bu slug zaten kullanılıyor.',
            'sku.unique' => 'Bu SKU zaten kullanılıyor.',
        ];
    }
}
```

## Enum Şablonu

```php
<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case Preparing = 'preparing';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Beklemede',
            self::Paid => 'Ödendi',
            self::Preparing => 'Hazırlanıyor',
            self::Shipped => 'Kargoda',
            self::Delivered => 'Teslim Edildi',
            self::Cancelled => 'İptal Edildi',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'yellow',
            self::Paid => 'blue',
            self::Preparing => 'orange',
            self::Shipped => 'purple',
            self::Delivered => 'green',
            self::Cancelled => 'red',
        };
    }
}
```

## Migration Kuralları

- Tablo isimleri snake_case, çoğul: `ingredients`, `mixer_templates`
- Foreign key isimleri: `model_id` formatında
- Decimal alanlar: `decimal('price', 10, 2)`
- JSON alanlar: `json('nutritional_info')->nullable()`
- Soft delete gereken tablolarda: `$table->softDeletes()`
- Index ekle: sık sorgulanan alanlara, foreign key'lere, slug'lara
- Enum yerine string + PHP Enum kullan (DB taşınabilirlik için)

## Route Yapısı

```php
// routes/api.php

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Public storefront routes
Route::prefix('storefront')->group(function () {
    Route::get('categories', [StorefrontCategoryController::class, 'index']);
    Route::get('ingredients', [StorefrontIngredientController::class, 'index']);
    Route::get('ingredients/{slug}', [StorefrontIngredientController::class, 'show']);
    // ... diğer public route'lar
});

// Auth required storefront routes
Route::middleware('auth:sanctum')->prefix('account')->group(function () {
    Route::get('profile', [AccountController::class, 'show']);
    Route::put('profile', [AccountController::class, 'update']);
    // ... diğer auth route'lar
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('categories', Admin\CategoryController::class);
    Route::apiResource('ingredients', Admin\IngredientController::class);
    Route::apiResource('mixer-templates', Admin\MixerTemplateController::class);
    // ... diğer admin route'lar
});
```
