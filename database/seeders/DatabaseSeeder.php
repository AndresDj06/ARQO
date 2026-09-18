<?php

namespace Database\Seeders;

use App\Models\CategoriaProyecto;
use App\Models\EstiloArquitectonico;
use App\Models\ImagenProyecto;
use App\Models\PerfilArquitecto;
use App\Models\PiePagina;
use App\Models\Proyecto;
use App\Models\Recurso;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@arqo.test'],
            [
                'name' => 'Administrador ARQO',
                'password' => Hash::make('password'),
            ]
        );

        PerfilArquitecto::query()->updateOrCreate(
            ['id_arquitecto' => 1],
            [
                'nombre_completo' => 'Ana Rivera',
                'titulo_profesional' => 'Arquitecta',
                'especialidad' => 'Arquitectura residencial y paisajismo',
                'biografia' => 'Estudio de arquitectura enfocado en proyectos que dialogan con el clima, el terreno y la luz. Diseñamos espacios habitables con rigor técnico y una narrativa visual clara.',
                'url_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
                'anos_experiencia' => 12,
            ]
        );

        $residencial = CategoriaProyecto::query()->updateOrCreate(
            ['nombre_categoria' => 'Residencial'],
            ['descripcion_categoria' => 'Vivienda unifamiliar y multifamiliar']
        );
        $comercial = CategoriaProyecto::query()->updateOrCreate(
            ['nombre_categoria' => 'Comercial'],
            ['descripcion_categoria' => 'Espacios de trabajo y comercio']
        );

        $moderno = EstiloArquitectonico::query()->updateOrCreate(
            ['nombre_estilo' => 'Moderno'],
            ['descripcion_estilo' => 'Volúmenes limpios, luz y materiales honestos']
        );
        $tropical = EstiloArquitectonico::query()->updateOrCreate(
            ['nombre_estilo' => 'Tropical'],
            ['descripcion_estilo' => 'Cruce de interior y paisaje']
        );

        $proyectos = [
            [
                'titulo' => 'Casa Bosque',
                'ubicacion' => 'Residencial · Medellín',
                'id_categoria' => $residencial->id_categoria,
                'id_estilo' => $tropical->id_estilo,
                'superficie_m2' => 186,
                'terreno_frente_m' => 12,
                'terreno_fondo_m' => 28,
                'plantas' => 2,
                'habitaciones' => 3,
                'banos' => 3,
                'estacionamientos' => 2,
                'descripcion' => 'Vivienda emplazada entre árboles existentes. El programa se abre hacia el bosque con una circulación lineal y patios que ventilán de forma cruzada.',
                'alcance_entregables' => 'Anteproyecto conceptual, planos arquitectónicos base, memoria descriptiva y renders de alto impacto.',
                'url_imagen_miniatura' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                'galeria' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
                    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
                ],
            ],
            [
                'titulo' => 'Casa Patio',
                'ubicacion' => 'Envigado',
                'id_categoria' => $residencial->id_categoria,
                'id_estilo' => $moderno->id_estilo,
                'superficie_m2' => 142,
                'terreno_frente_m' => 10,
                'terreno_fondo_m' => 20,
                'plantas' => 2,
                'habitaciones' => 3,
                'banos' => 2,
                'estacionamientos' => 1,
                'descripcion' => 'Un patio central organiza la vida doméstica. La materialidad en concreto aparente y madera define una paleta serena.',
                'alcance_entregables' => 'Anteproyecto, planos arquitectónicos, presupuesto preliminar y modelo 3D.',
                'url_imagen_miniatura' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                'galeria' => [
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdbc?auto=format&fit=crop&w=1600&q=80',
                    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80',
                ],
            ],
            [
                'titulo' => 'Atelier Norte',
                'ubicacion' => 'Comercial · Medellín',
                'id_categoria' => $comercial->id_categoria,
                'id_estilo' => $moderno->id_estilo,
                'superficie_m2' => 98,
                'plantas' => 1,
                'descripcion' => 'Estudio creativo con luz norte y un sistema de estanterías que funciona como fachada interior.',
                'alcance_entregables' => 'Diseño interior, planos de layout y especificación de iluminación.',
                'url_imagen_miniatura' => 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
                'galeria' => [
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
                ],
            ],
            [
                'titulo' => 'Refugio Ladera',
                'ubicacion' => 'El Retiro',
                'id_categoria' => $residencial->id_categoria,
                'id_estilo' => $tropical->id_estilo,
                'superficie_m2' => 120,
                'terreno_frente_m' => 14,
                'terreno_fondo_m' => 22,
                'plantas' => 1,
                'habitaciones' => 2,
                'banos' => 2,
                'estacionamientos' => 1,
                'descripcion' => 'Un volumen ligero se posa sobre la pendiente. Terrazas cubiertas extienden la sala hacia el paisaje.',
                'alcance_entregables' => 'Anteproyecto conceptual, planos base y memoria descriptiva.',
                'url_imagen_miniatura' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'galeria' => [
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
                ],
            ],
        ];

        foreach ($proyectos as $item) {
            $galeria = $item['galeria'];
            unset($item['galeria']);

            $proyecto = Proyecto::query()->updateOrCreate(
                ['titulo' => $item['titulo']],
                $item + ['estado_visible' => true]
            );

            $proyecto->imagenes()->delete();
            foreach ($galeria as $index => $url) {
                ImagenProyecto::query()->create([
                    'id_proyecto' => $proyecto->id_proyecto,
                    'url_imagen' => $url,
                    'orden_visualizacion' => $index + 1,
                ]);
            }
        }

        Servicio::query()->updateOrCreate(
            ['nombre_servicio' => 'Diseño arquitectónico'],
            [
                'descripcion_corta' => 'Desde el concepto hasta la documentación técnica.',
                'descripcion_detallada' => 'Desarrollamos anteproyecto, proyecto arquitectónico y coordinación con especialidades.',
                'estado_activo' => true,
            ]
        );
        Servicio::query()->updateOrCreate(
            ['nombre_servicio' => 'Remodelación'],
            [
                'descripcion_corta' => 'Intervenciones precisas sobre lo existente.',
                'descripcion_detallada' => 'Diagnóstico, propuesta espacial y dirección de obra ligera.',
                'estado_activo' => true,
            ]
        );
        Servicio::query()->updateOrCreate(
            ['nombre_servicio' => 'Visualización'],
            [
                'descripcion_corta' => 'Renders y recorridos para tomar decisiones.',
                'descripcion_detallada' => 'Imágenes fotorrealistas, laminas de presentación y video corto del proyecto.',
                'estado_activo' => true,
            ]
        );

        Recurso::query()->updateOrCreate(
            ['titulo_recurso' => 'Guía de briefing'],
            [
                'tipo_recurso' => 'PDF',
                'descripcion' => 'Preguntas para iniciar un encargo con claridad.',
                'url_enlace' => 'https://example.com/briefing-arqo.pdf',
                'estado_activo' => true,
            ]
        );
        Recurso::query()->updateOrCreate(
            ['titulo_recurso' => 'Notas de materialidad'],
            [
                'tipo_recurso' => 'Artículo',
                'descripcion' => 'Criterios para elegir materiales en clima tropical.',
                'url_enlace' => 'https://example.com/materialidad',
                'estado_activo' => true,
            ]
        );

        PiePagina::query()->updateOrCreate(
            ['id_pie' => 1],
            [
                'nombre_estudio' => 'ARQO',
                'ciudad' => 'Medellín, Colombia',
                'email_publico' => 'estudio@arqo.test',
                'instagram_url' => 'https://instagram.com/',
                'linkedin_url' => null,
                'nota_corta' => 'Arquitectura, paisaje y luz. Encargos seleccionados.',
                'texto_legal' => 'ARQO estudio. Todos los derechos reservados.',
            ]
        );
    }
}
