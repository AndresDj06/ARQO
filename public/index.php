<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// XAMPP subdirectory: /arqo rewrites into /public, but the browser URL
// does not include /public. Align SCRIPT_NAME so Laravel routing matches.
$scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
if (str_ends_with($scriptName, '/public/index.php')) {
    $publicDir = dirname($scriptName);
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    if (! str_starts_with($uriPath, $publicDir)) {
        $_SERVER['SCRIPT_NAME'] = substr($scriptName, 0, -strlen('/public/index.php')).'/index.php';
        if (isset($_SERVER['PHP_SELF'])) {
            $_SERVER['PHP_SELF'] = str_replace('/public/index.php', '/index.php', str_replace('\\', '/', $_SERVER['PHP_SELF']));
        }
    }
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
