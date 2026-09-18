<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pies_pagina', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_pie');
            $table->string('nombre_estudio', 80);
            $table->string('ciudad', 120)->nullable();
            $table->string('email_publico', 120)->nullable();
            $table->string('instagram_url', 255)->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->string('nota_corta', 220)->nullable();
            $table->string('texto_legal', 180)->nullable();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pies_pagina');
    }
};
