<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EstiloController;
use App\Http\Controllers\Api\PerfilController;
use App\Http\Controllers\Api\PieController;
use App\Http\Controllers\Api\ProyectoController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\RecursoController;
use App\Http\Controllers\Api\ServicioController;
use Illuminate\Support\Facades\Route;

Route::get('/public/landing', [PublicController::class, 'landing']);
Route::get('/public/proyectos/{proyecto}', [PublicController::class, 'proyecto']);
Route::get('/public/catalogos', [PublicController::class, 'catalogos']);

Route::prefix('auth')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth')->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::middleware('auth')->prefix('admin')->group(function (): void {
    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::post('/perfil', [PerfilController::class, 'update']);

    Route::get('/pie', [PieController::class, 'show']);
    Route::post('/pie', [PieController::class, 'update']);

    Route::get('/proyectos', [ProyectoController::class, 'index']);
    Route::post('/proyectos', [ProyectoController::class, 'store']);
    Route::get('/proyectos/{proyecto}', [ProyectoController::class, 'show']);
    Route::post('/proyectos/{proyecto}', [ProyectoController::class, 'update']);
    Route::delete('/proyectos/{proyecto}', [ProyectoController::class, 'destroy']);

    Route::get('/servicios', [ServicioController::class, 'index']);
    Route::post('/servicios', [ServicioController::class, 'store']);
    Route::put('/servicios/{servicio}', [ServicioController::class, 'update']);
    Route::delete('/servicios/{servicio}', [ServicioController::class, 'destroy']);

    Route::get('/recursos', [RecursoController::class, 'index']);
    Route::post('/recursos', [RecursoController::class, 'store']);
    Route::put('/recursos/{recurso}', [RecursoController::class, 'update']);
    Route::delete('/recursos/{recurso}', [RecursoController::class, 'destroy']);

    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);

    Route::get('/estilos', [EstiloController::class, 'index']);
    Route::post('/estilos', [EstiloController::class, 'store']);
    Route::put('/estilos/{estilo}', [EstiloController::class, 'update']);
    Route::delete('/estilos/{estilo}', [EstiloController::class, 'destroy']);
});
