<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImagenProyecto extends Model
{
    protected $table = 'imagenes_proyecto';

    protected $primaryKey = 'id_imagen';

    public $timestamps = false;

    protected $fillable = [
        'id_proyecto',
        'url_imagen',
        'orden_visualizacion',
    ];

    protected $appends = ['imagen_url'];

    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'id_proyecto', 'id_proyecto');
    }

    public function getImagenUrlAttribute(): ?string
    {
        return Media::url($this->url_imagen);
    }
}
