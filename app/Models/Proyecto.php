<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proyecto extends Model
{
    protected $table = 'proyectos';

    protected $primaryKey = 'id_proyecto';

    public $timestamps = false;

    protected $fillable = [
        'id_categoria',
        'id_estilo',
        'titulo',
        'ubicacion',
        'superficie_m2',
        'terreno_frente_m',
        'terreno_fondo_m',
        'descripcion',
        'plantas',
        'habitaciones',
        'banos',
        'estacionamientos',
        'alcance_entregables',
        'url_imagen_miniatura',
        'url_video_corto',
        'estado_visible',
    ];

    protected $casts = [
        'superficie_m2' => 'float',
        'terreno_frente_m' => 'float',
        'terreno_fondo_m' => 'float',
        'estado_visible' => 'boolean',
        'fecha_creacion' => 'datetime',
    ];

    protected $appends = ['miniatura_url', 'video_url', 'resumen_tecnico'];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaProyecto::class, 'id_categoria', 'id_categoria');
    }

    public function estilo(): BelongsTo
    {
        return $this->belongsTo(EstiloArquitectonico::class, 'id_estilo', 'id_estilo');
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(ImagenProyecto::class, 'id_proyecto', 'id_proyecto')
            ->orderBy('orden_visualizacion');
    }

    public function getMiniaturaUrlAttribute(): ?string
    {
        return Media::url($this->url_imagen_miniatura);
    }

    public function getVideoUrlAttribute(): ?string
    {
        return Media::url($this->url_video_corto);
    }

    public function getResumenTecnicoAttribute(): string
    {
        $parts = [];

        if ($this->superficie_m2) {
            $parts[] = rtrim(rtrim(number_format((float) $this->superficie_m2, 2, '.', ''), '0'), '.').' m²';
        }
        if ($this->plantas) {
            $parts[] = $this->plantas.' '.($this->plantas === 1 ? 'planta' : 'plantas');
        }
        if ($this->habitaciones) {
            $parts[] = $this->habitaciones.' '.($this->habitaciones === 1 ? 'habitación' : 'habitaciones');
        }
        if ($this->banos) {
            $parts[] = $this->banos.' '.($this->banos === 1 ? 'baño' : 'baños');
        }
        if ($this->estacionamientos) {
            $parts[] = $this->estacionamientos.' '.($this->estacionamientos === 1 ? 'estacionamiento' : 'estacionamientos');
        }
        if ($this->estilo?->nombre_estilo) {
            $parts[] = 'Estilo '.$this->estilo->nombre_estilo;
        }

        return implode(' · ', $parts);
    }
}
