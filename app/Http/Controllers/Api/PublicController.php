<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaProyecto;
use App\Models\EstiloArquitectonico;
use App\Models\PerfilArquitecto;
use App\Models\PiePagina;
use App\Models\Proyecto;
use App\Models\Recurso;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    public function landing(): JsonResponse
    {
        $servicios = Servicio::query()->where('estado_activo', true)->orderBy('id_servicio')->get();
        $recursos = Recurso::query()->where('estado_activo', true)->orderBy('id_recurso')->get();

        return response()->json([
            'perfil' => PerfilArquitecto::query()->first(),
            'proyectos' => Proyecto::query()
                ->with(['categoria', 'estilo', 'imagenes'])
                ->where('estado_visible', true)
                ->orderByDesc('fecha_creacion')
                ->get(),
            'servicios' => $servicios,
            'recursos' => $recursos,
            'pie' => PiePagina::query()->first(),
            'whatsapp' => config('arqo.whatsapp'),
            'hero_video' => $this->heroVideoUrl(),
        ]);
    }

    public function proyecto(Proyecto $proyecto): JsonResponse
    {
        abort_unless($proyecto->estado_visible, 404);

        $proyecto->load(['categoria', 'estilo', 'imagenes']);

        return response()->json([
            'proyecto' => $proyecto,
            'whatsapp' => config('arqo.whatsapp'),
        ]);
    }

    public function catalogos(): JsonResponse
    {
        return response()->json([
            'categorias' => CategoriaProyecto::query()->orderBy('nombre_categoria')->get(),
            'estilos' => EstiloArquitectonico::query()->orderBy('nombre_estilo')->get(),
        ]);
    }

    private function heroVideoUrl(): string
    {
        $path = (string) config('arqo.hero_video');

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return asset(ltrim($path, '/'));
    }
}
