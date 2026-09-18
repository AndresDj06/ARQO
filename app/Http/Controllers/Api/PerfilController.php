<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerfilArquitecto;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerfilController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'perfil' => PerfilArquitecto::query()->first() ?? PerfilArquitecto::query()->create([
                'nombre_completo' => 'ARQO',
            ]),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        if ($request->input('anos_experiencia') === '' || $request->input('anos_experiencia') === null) {
            $request->merge(['anos_experiencia' => null]);
        }

        $data = $request->validate([
            'nombre_completo' => ['required', 'string', 'max:100'],
            'titulo_profesional' => ['nullable', 'string', 'max:100'],
            'biografia' => ['nullable', 'string', 'max:1000'],
            'especialidad' => ['nullable', 'string', 'max:150'],
            'anos_experiencia' => ['nullable', 'integer', 'min:0', 'max:80'],
            'avatar' => ['nullable', 'file', 'image', 'max:5120'],
        ]);

        $perfil = PerfilArquitecto::query()->first() ?? new PerfilArquitecto;

        if ($request->hasFile('avatar')) {
            Media::delete($perfil->url_avatar);
            $data['url_avatar'] = Media::storeImage($request->file('avatar'), 'avatars', 800);
        }

        unset($data['avatar']);
        $perfil->fill($data);
        $perfil->save();

        return response()->json(['perfil' => $perfil->fresh()]);
    }
}
