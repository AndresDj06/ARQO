<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recurso;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecursoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['recursos' => Recurso::query()->orderBy('id_recurso')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $recurso = Recurso::query()->create($this->validated($request));

        return response()->json(['recurso' => $recurso], 201);
    }

    public function update(Request $request, Recurso $recurso): JsonResponse
    {
        $recurso->update($this->validated($request));

        return response()->json(['recurso' => $recurso->fresh()]);
    }

    public function destroy(Recurso $recurso): JsonResponse
    {
        $recurso->delete();

        return response()->json(['ok' => true]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'titulo_recurso' => ['required', 'string', 'max:100'],
            'tipo_recurso' => ['nullable', 'string', 'max:50'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'url_enlace' => ['required', 'string', 'max:255'],
            'estado_activo' => ['nullable', 'boolean'],
        ]);

        $data['estado_activo'] = $request->boolean('estado_activo', true);

        return $data;
    }
}
