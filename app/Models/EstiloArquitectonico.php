<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstiloArquitectonico extends Model
{
    protected $table = 'estilos_arquitectonicos';

    protected $primaryKey = 'id_estilo';

    public $timestamps = false;

    protected $fillable = [
        'nombre_estilo',
        'descripcion_estilo',
    ];

    public function proyectos(): HasMany
    {
        return $this->hasMany(Proyecto::class, 'id_estilo', 'id_estilo');
    }
}
