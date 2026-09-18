<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstiloArquitectonico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EstiloController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'estilos' => EstiloArquitectonico::query()->orderBy('nombre_estilo')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $estilo = EstiloArquitectonico::query()->create($this->validated($request));

        return response()->json(['estilo' => $estilo], 201);
    }

    public function update(Request $request, EstiloArquitectonico $estilo): JsonResponse
    {
        $estilo->update($this->validated($request));

        return response()->json(['estilo' => $estilo->fresh()]);
    }

    public function destroy(EstiloArquitectonico $estilo): JsonResponse
    {
        if ($estilo->proyectos()->exists()) {
            return response()->json([
                'message' => 'No puedes eliminar un estilo asignado a proyectos.',
            ], 422);
        }

        $estilo->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nombre_estilo' => ['required', 'string', 'max:50'],
            'descripcion_estilo' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
