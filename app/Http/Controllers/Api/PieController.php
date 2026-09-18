<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PiePagina;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PieController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['pie' => $this->singleton()]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->merge([
            'ciudad' => $request->input('ciudad') ?: null,
            'email_publico' => $request->input('email_publico') ?: null,
            'instagram_url' => $request->input('instagram_url') ?: null,
            'linkedin_url' => $request->input('linkedin_url') ?: null,
            'nota_corta' => $request->input('nota_corta') ?: null,
            'texto_legal' => $request->input('texto_legal') ?: null,
        ]);

        $data = $request->validate([
            'nombre_estudio' => ['required', 'string', 'max:80'],
            'ciudad' => ['nullable', 'string', 'max:120'],
            'email_publico' => ['nullable', 'email', 'max:120'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'nota_corta' => ['nullable', 'string', 'max:220'],
            'texto_legal' => ['nullable', 'string', 'max:180'],
        ]);

        $pie = $this->singleton();
        $pie->fill($data);
        $pie->save();

        return response()->json(['pie' => $pie->fresh()]);
    }

    private function singleton(): PiePagina
    {
        return PiePagina::query()->first() ?? PiePagina::query()->create([
            'nombre_estudio' => 'ARQO',
            'texto_legal' => 'Estudio de arquitectura. Todos los derechos reservados.',
        ]);
    }
}
