<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaProyecto extends Model
{
    protected $table = 'categorias_proyecto';

    protected $primaryKey = 'id_categoria';

    public $timestamps = false;

    protected $fillable = [
        'nombre_categoria',
        'descripcion_categoria',
    ];

    public function proyectos(): HasMany
    {
        return $this->hasMany(Proyecto::class, 'id_categoria', 'id_categoria');
    }
}
