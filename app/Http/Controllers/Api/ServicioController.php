<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['servicios' => Servicio::query()->orderBy('id_servicio')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $servicio = Servicio::query()->create($this->validated($request));

        return response()->json(['servicio' => $servicio], 201);
    }

    public function update(Request $request, Servicio $servicio): JsonResponse
    {
        $servicio->update($this->validated($request));

        return response()->json(['servicio' => $servicio->fresh()]);
    }

    public function destroy(Servicio $servicio): JsonResponse
    {
        $servicio->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'nombre_servicio' => ['required', 'string', 'max:100'],
            'descripcion_corta' => ['nullable', 'string', 'max:255'],
            'descripcion_detallada' => ['nullable', 'string', 'max:1000'],
            'url_icono' => ['nullable', 'string', 'max:255'],
            'estado_activo' => ['nullable', 'boolean'],
        ]);

        $data['estado_activo'] = $request->boolean('estado_activo', true);

        return $data;
    }
}
