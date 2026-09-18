<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenProyecto;
use App\Models\Proyecto;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProyectoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'proyectos' => Proyecto::query()
                ->with(['categoria', 'estilo', 'imagenes'])
                ->orderByDesc('fecha_creacion')
                ->get(),
        ]);
    }

    public function show(Proyecto $proyecto): JsonResponse
    {
        $proyecto->load(['categoria', 'estilo', 'imagenes']);

        return response()->json(['proyecto' => $proyecto]);
    }

    public function store(Request $request): JsonResponse
    {
        $proyecto = DB::transaction(fn () => $this->persist($request, new Proyecto));

        return response()->json(['proyecto' => $proyecto], 201);
    }

    public function update(Request $request, Proyecto $proyecto): JsonResponse
    {
        $proyecto = DB::transaction(fn () => $this->persist($request, $proyecto));

        return response()->json(['proyecto' => $proyecto]);
    }

    public function destroy(Proyecto $proyecto): JsonResponse
    {
        Media::delete($proyecto->url_imagen_miniatura);
        Media::delete($proyecto->url_video_corto);

        foreach ($proyecto->imagenes as $imagen) {
            Media::delete($imagen->url_imagen);
        }

        $proyecto->delete();

        return response()->json(['ok' => true]);
    }

    private function persist(Request $request, Proyecto $proyecto): Proyecto
    {
        foreach (['id_categoria', 'id_estilo', 'superficie_m2', 'terreno_frente_m', 'terreno_fondo_m', 'plantas', 'habitaciones', 'banos', 'estacionamientos'] as $field) {
            if ($request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        $data = $request->validate([
            'titulo' => ['required', 'string', 'max:100'],
            'id_categoria' => ['nullable', 'integer', 'exists:categorias_proyecto,id_categoria'],
            'id_estilo' => ['nullable', 'integer', 'exists:estilos_arquitectonicos,id_estilo'],
            'ubicacion' => ['nullable', 'string', 'max:150'],
            'superficie_m2' => ['nullable', 'numeric', 'min:0'],
            'terreno_frente_m' => ['nullable', 'numeric', 'min:0'],
            'terreno_fondo_m' => ['nullable', 'numeric', 'min:0'],
            'descripcion' => ['nullable', 'string', 'max:2200'],
            'plantas' => ['nullable', 'integer', 'min:0'],
            'habitaciones' => ['nullable', 'integer', 'min:0'],
            'banos' => ['nullable', 'integer', 'min:0'],
            'estacionamientos' => ['nullable', 'integer', 'min:0'],
            'alcance_entregables' => ['nullable', 'string', 'max:1000'],
            'estado_visible' => ['nullable', 'boolean'],
            'miniatura' => ['nullable', 'image', 'max:8192'],
            'video_corto' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:20480'],
            'galeria.*' => ['nullable', 'image', 'max:8192'],
            'eliminar_imagenes' => ['nullable', 'array'],
            'eliminar_imagenes.*' => ['integer'],
        ]);

        $proyecto->fill([
            'titulo' => $data['titulo'],
            'id_categoria' => $data['id_categoria'] ?? null,
            'id_estilo' => $data['id_estilo'] ?? null,
            'ubicacion' => $data['ubicacion'] ?? null,
            'superficie_m2' => $data['superficie_m2'] ?? null,
            'terreno_frente_m' => $data['terreno_frente_m'] ?? null,
            'terreno_fondo_m' => $data['terreno_fondo_m'] ?? null,
            'descripcion' => $data['descripcion'] ?? null,
            'plantas' => $data['plantas'] ?? null,
            'habitaciones' => $data['habitaciones'] ?? null,
            'banos' => $data['banos'] ?? null,
            'estacionamientos' => $data['estacionamientos'] ?? null,
            'alcance_entregables' => $data['alcance_entregables'] ?? null,
            'estado_visible' => $request->boolean('estado_visible', true),
        ]);
        $proyecto->save();

        if ($request->hasFile('miniatura')) {
            Media::delete($proyecto->url_imagen_miniatura);
            $proyecto->url_imagen_miniatura = Media::storeImage($request->file('miniatura'), 'proyectos/miniaturas', 1200);
            $proyecto->save();
        }

        if ($request->hasFile('video_corto')) {
            Media::delete($proyecto->url_video_corto);
            $proyecto->url_video_corto = $request->file('video_corto')->store('proyectos/videos', 'public');
            $proyecto->save();
        }

        $eliminar = $request->input('eliminar_imagenes', []);
        if (is_array($eliminar) && $eliminar !== []) {
            $imagenes = ImagenProyecto::query()
                ->where('id_proyecto', $proyecto->id_proyecto)
                ->whereIn('id_imagen', $eliminar)
                ->get();

            foreach ($imagenes as $imagen) {
                Media::delete($imagen->url_imagen);
                $imagen->delete();
            }
        }

        $existentes = $proyecto->imagenes()->count();
        $nuevas = $request->file('galeria', []);
        if (! is_array($nuevas)) {
            $nuevas = $nuevas ? [$nuevas] : [];
        }

        abort_if($existentes + count($nuevas) > 4, 422, 'El carrusel admite máximo 4 fotografías.');

        $orden = $existentes;
        foreach ($nuevas as $archivo) {
            $orden++;
            ImagenProyecto::query()->create([
                'id_proyecto' => $proyecto->id_proyecto,
                'url_imagen' => Media::storeImage($archivo, 'proyectos/galeria', 1800),
                'orden_visualizacion' => $orden,
            ]);
        }

        return $proyecto->fresh(['categoria', 'estilo', 'imagenes']);
    }
}
