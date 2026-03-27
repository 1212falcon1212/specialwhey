<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Storefront\CalculatePriceRequest;
use App\Http\Resources\Storefront\MixerTemplateResource;
use App\Services\Storefront\StorefrontMixerService;
use Illuminate\Http\JsonResponse;

class MixerController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StorefrontMixerService $mixerService
    ) {}

    public function templates(): JsonResponse
    {
        $templates = $this->mixerService->getTemplates();

        return $this->success(MixerTemplateResource::collection($templates));
    }

    public function templateShow(string $slug): JsonResponse
    {
        $template = $this->mixerService->findTemplateBySlug($slug);

        return $this->success(new MixerTemplateResource($template));
    }

    public function calculatePrice(CalculatePriceRequest $request): JsonResponse
    {
        $result = $this->mixerService->calculatePrice($request->validated()['items']);

        return $this->success($result);
    }
}
