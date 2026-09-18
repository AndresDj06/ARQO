<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'servicios';

    protected $primaryKey = 'id_servicio';

    public $timestamps = false;

    protected $fillable = [
        'nombre_servicio',
        'descripcion_corta',
        'descripcion_detallada',
        'url_icono',
        'estado_activo',
    ];

    protected $casts = [
        'estado_activo' => 'boolean',
        'fecha_creacion' => 'datetime',
    ];
}
