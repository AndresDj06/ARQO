<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PiePagina extends Model
{
    protected $table = 'pies_pagina';

    protected $primaryKey = 'id_pie';

    public $timestamps = false;

    protected $fillable = [
        'nombre_estudio',
        'ciudad',
        'email_publico',
        'instagram_url',
        'linkedin_url',
        'nota_corta',
        'texto_legal',
    ];
}
