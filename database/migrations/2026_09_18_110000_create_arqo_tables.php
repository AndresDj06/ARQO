<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perfil_arquitectos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_arquitecto');
            $table->string('nombre_completo', 100);
            $table->string('titulo_profesional', 100)->nullable();
            $table->string('biografia', 1000)->nullable();
            $table->string('especialidad', 150)->nullable();
            $table->string('url_avatar', 255)->nullable();
            $table->unsignedInteger('anos_experiencia')->nullable();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('categorias_proyecto', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_categoria');
            $table->string('nombre_categoria', 50)->unique();
            $table->string('descripcion_categoria', 255)->nullable();
        });

        Schema::create('estilos_arquitectonicos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_estilo');
            $table->string('nombre_estilo', 50)->unique();
            $table->string('descripcion_estilo', 255)->nullable();
        });

        Schema::create('proyectos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_proyecto');
            $table->foreignId('id_categoria')->nullable()->constrained('categorias_proyecto', 'id_categoria')->nullOnDelete();
            $table->foreignId('id_estilo')->nullable()->constrained('estilos_arquitectonicos', 'id_estilo')->nullOnDelete();
            $table->string('titulo', 100);
            $table->string('ubicacion', 150)->nullable();
            $table->decimal('superficie_m2', 10, 2)->nullable();
            $table->decimal('terreno_frente_m', 10, 2)->nullable();
            $table->decimal('terreno_fondo_m', 10, 2)->nullable();
            $table->string('descripcion', 2200)->nullable();
            $table->unsignedInteger('plantas')->nullable();
            $table->unsignedInteger('habitaciones')->nullable();
            $table->unsignedInteger('banos')->nullable();
            $table->unsignedInteger('estacionamientos')->nullable();
            $table->string('alcance_entregables', 1000)->nullable();
            $table->string('url_imagen_miniatura', 255)->nullable();
            $table->string('url_video_corto', 255)->nullable();
            $table->boolean('estado_visible')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->index('estado_visible');
        });

        Schema::create('imagenes_proyecto', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_imagen');
            $table->foreignId('id_proyecto')->constrained('proyectos', 'id_proyecto')->cascadeOnDelete();
            $table->string('url_imagen', 255);
            $table->unsignedTinyInteger('orden_visualizacion');
            $table->timestamp('fecha_carga')->useCurrent();
            $table->unique(['id_proyecto', 'orden_visualizacion']);
        });

        DB::statement('ALTER TABLE imagenes_proyecto ADD CONSTRAINT imagenes_proyecto_orden_chk CHECK (orden_visualizacion BETWEEN 1 AND 4)');

        Schema::create('servicios', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_servicio');
            $table->string('nombre_servicio', 100);
            $table->string('descripcion_corta', 255)->nullable();
            $table->string('descripcion_detallada', 1000)->nullable();
            $table->string('url_icono', 255)->nullable();
            $table->boolean('estado_activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
        });

        Schema::create('recursos', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_recurso');
            $table->string('titulo_recurso', 100);
            $table->string('tipo_recurso', 50)->nullable();
            $table->string('descripcion', 500)->nullable();
            $table->string('url_enlace', 255);
            $table->boolean('estado_activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recursos');
        Schema::dropIfExists('servicios');
        Schema::dropIfExists('imagenes_proyecto');
        Schema::dropIfExists('proyectos');
        Schema::dropIfExists('estilos_arquitectonicos');
        Schema::dropIfExists('categorias_proyecto');
        Schema::dropIfExists('perfil_arquitectos');
    }
};
