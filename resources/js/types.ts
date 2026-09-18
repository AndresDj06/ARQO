export type Perfil = {
    id_arquitecto: number;
    nombre_completo: string;
    titulo_profesional?: string | null;
    biografia?: string | null;
    especialidad?: string | null;
    avatar_url?: string | null;
    anos_experiencia?: number | null;
};

export type Servicio = {
    id_servicio: number;
    nombre_servicio: string;
    descripcion_corta?: string | null;
    descripcion_detallada?: string | null;
    estado_activo: boolean;
};

export type Recurso = {
    id_recurso: number;
    titulo_recurso: string;
    tipo_recurso?: string | null;
    descripcion?: string | null;
    url_enlace: string;
    estado_activo: boolean;
};

export type Imagen = {
    id_imagen: number;
    imagen_url: string;
    orden_visualizacion: number;
};

export type Proyecto = {
    id_proyecto: number;
    titulo: string;
    ubicacion?: string | null;
    superficie_m2?: number | null;
    terreno_frente_m?: number | null;
    terreno_fondo_m?: number | null;
    descripcion?: string | null;
    plantas?: number | null;
    habitaciones?: number | null;
    banos?: number | null;
    estacionamientos?: number | null;
    alcance_entregables?: string | null;
    miniatura_url?: string | null;
    video_url?: string | null;
    estado_visible: boolean;
    resumen_tecnico?: string;
    categoria?: { id_categoria: number; nombre_categoria: string } | null;
    estilo?: { id_estilo: number; nombre_estilo: string } | null;
    imagenes: Imagen[];
};

export type PiePagina = {
    id_pie?: number;
    nombre_estudio: string;
    ciudad?: string | null;
    email_publico?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    nota_corta?: string | null;
    texto_legal?: string | null;
};

export type LandingPayload = {
    perfil: Perfil | null;
    proyectos: Proyecto[];
    servicios: Servicio[];
    recursos: Recurso[];
    pie: PiePagina | null;
    whatsapp: string;
    hero_video: string;
};
