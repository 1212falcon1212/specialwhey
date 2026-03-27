<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\StoreMixerTemplateRequest;
use App\Http\Requests\Admin\UpdateMixerTemplateRequest;
use App\Http\Resources\Admin\MixerTemplateResource;
use App\Services\MixerTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MixerTemplateController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly MixerTemplateService $mixerTemplateService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $templates = $this->mixerTemplateService->getAll($request->all());

        return $this->successWithMeta(
            MixerTemplateResource::collection($templates),
            [
                'current_page' => $templates->currentPage(),
                'last_page' => $templates->lastPage(),
                'per_page' => $templates->perPage(),
                'total' => $templates->total(),
            ]
        );
    }

    public function store(StoreMixerTemplateRequest $request): JsonResponse
    {
        $template = $this->mixerTemplateService->create($request->validated());

        return $this->created(
            new MixerTemplateResource($template),
            'Mixer şablonu başarıyla oluşturuldu.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $template = $this->mixerTemplateService->findOrFail($id);

        return $this->success(new MixerTemplateResource($template));
    }

    public function update(UpdateMixerTemplateRequest $request, int $id): JsonResponse
    {
        $template = $this->mixerTemplateService->update($id, $request->validated());

        return $this->success(
            new MixerTemplateResource($template),
            'Mixer şablonu başarıyla güncellendi.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->mixerTemplateService->delete($id);

        return $this->deleted('Mixer şablonu başarıyla silindi.');
    }
}
