<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    protected $table = 'recursos';

    protected $primaryKey = 'id_recurso';

    public $timestamps = false;

    protected $fillable = [
        'titulo_recurso',
        'tipo_recurso',
        'descripcion',
        'url_enlace',
        'estado_activo',
    ];

    protected $casts = [
        'estado_activo' => 'boolean',
        'fecha_creacion' => 'datetime',
    ];
}
