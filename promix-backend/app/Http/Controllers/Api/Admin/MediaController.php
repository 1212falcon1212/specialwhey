<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly MediaService $mediaService
    ) {}

    public function upload(UploadMediaRequest $request): JsonResponse
    {
        $media = $this->mediaService->upload(
            $request->file('file'),
            $request->input('collection')
        );

        return $this->created([
            'id' => $media->id,
            'filename' => $media->filename,
            'path' => $media->path,
            'url' => Storage::disk('public')->url($media->path),
            'mime_type' => $media->mime_type,
            'size' => $media->size,
        ], 'Dosya başarıyla yüklendi.');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->mediaService->delete($id);

        return $this->deleted('Dosya başarıyla silindi.');
    }
}
