<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    public function upload(UploadedFile $file, ?string $collection = null): Media
    {
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $directory = 'uploads/'.($collection ?? 'general').'/'.now()->format('Y/m');
        $path = $file->storeAs($directory, $filename, 'public');

        return Media::create([
            'model_type' => 'general',
            'model_id' => 0,
            'collection' => $collection,
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'sort_order' => 0,
        ]);
    }

    public function delete(int $id): void
    {
        $media = Media::findOrFail($id);

        // Dosyayı diskten sil
        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();
    }

    public function getUrl(Media $media): string
    {
        return Storage::disk('public')->url($media->path);
    }
}
