<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media
{
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return asset('storage/'.$path);
    }

    public static function storeImage(UploadedFile $file, string $directory, int $maxWidth = 1600): string
    {
        $name = Str::uuid()->toString().'.jpg';
        $relative = trim($directory, '/').'/'.$name;
        $absoluteDir = storage_path('app/public/'.$directory);

        if (! is_dir($absoluteDir)) {
            mkdir($absoluteDir, 0755, true);
        }

        $sourcePath = $file->getRealPath();
        $info = getimagesize($sourcePath) ?: [0, 0, IMAGETYPE_JPEG];
        $type = $info[2] ?? IMAGETYPE_JPEG;

        $source = match ($type) {
            IMAGETYPE_PNG => imagecreatefrompng($sourcePath),
            IMAGETYPE_GIF => imagecreatefromgif($sourcePath),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($sourcePath) : imagecreatefromjpeg($sourcePath),
            default => imagecreatefromjpeg($sourcePath),
        };

        if ($source === false) {
            $file->storeAs($directory, $name, 'public');

            return $relative;
        }

        $width = imagesx($source);
        $height = imagesy($source);

        if ($width > $maxWidth) {
            $newHeight = (int) round($height * ($maxWidth / $width));
            $canvas = imagecreatetruecolor($maxWidth, $newHeight);
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $maxWidth, $newHeight, $width, $height);
            imagedestroy($source);
            $source = $canvas;
        }

        imagejpeg($source, storage_path('app/public/'.$relative), 82);
        imagedestroy($source);

        return $relative;
    }

    public static function delete(?string $path): void
    {
        if (! $path || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
