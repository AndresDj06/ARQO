<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaProyecto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'categorias' => CategoriaProyecto::query()->orderBy('nombre_categoria')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $categoria = CategoriaProyecto::query()->create($this->validated($request));

        return response()->json(['categoria' => $categoria], 201);
    }

    public function update(Request $request, CategoriaProyecto $categoria): JsonResponse
    {
        $categoria->update($this->validated($request));

        return response()->json(['categoria' => $categoria->fresh()]);
    }

    public function destroy(CategoriaProyecto $categoria): JsonResponse
    {
        if ($categoria->proyectos()->exists()) {
            return response()->json([
                'message' => 'No puedes eliminar una categoría asignada a proyectos.',
            ], 422);
        }

        $categoria->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nombre_categoria' => ['required', 'string', 'max:50'],
            'descripcion_categoria' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
