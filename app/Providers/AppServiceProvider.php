<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $base = $this->detectWebBase();
        $basename = $base === '' ? '/' : $base;

        View::share('webBase', $basename);

        if ($this->app->runningInConsole()) {
            return;
        }

        $root = request()->getSchemeAndHttpHost().($base === '' ? '' : $base);
        URL::forceRootUrl($root);
    }

    private function detectWebBase(): string
    {
        $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
        $dir = rtrim(dirname($scriptName), '/');

        if ($dir === '' || $dir === '/' || $dir === '.') {
            return '';
        }

        $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

        if (str_ends_with($dir, '/public') && ! str_starts_with($requestPath, $dir)) {
            $dir = substr($dir, 0, -strlen('/public'));
        }

        return $dir === '' || $dir === '/' ? '' : $dir;
    }
}
