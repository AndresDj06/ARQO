<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class PerfilArquitecto extends Model
{
    protected $table = 'perfil_arquitectos';

    protected $primaryKey = 'id_arquitecto';

    public $timestamps = false;

    protected $fillable = [
        'nombre_completo',
        'titulo_profesional',
        'biografia',
        'especialidad',
        'url_avatar',
        'anos_experiencia',
    ];

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): ?string
    {
        return Media::url($this->url_avatar);
    }
}
