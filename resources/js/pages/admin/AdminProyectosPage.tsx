import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { mediaUrl } from '@/lib/utils';
import type { Proyecto } from '@/types';

export default function AdminProyectosPage() {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);

    function load() {
        api.get('/admin/proyectos').then((response) => setProyectos(response.data.proyectos));
    }

    useEffect(() => {
        load();
    }, []);

    async function remove(id: number) {
        if (!confirm('¿Eliminar esta publicación?')) return;
        await api.delete(`/admin/proyectos/${id}`);
        load();
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">CRUD publicaciones</p>
                    <h1 className="font-heading mt-2 text-3xl">Portafolio</h1>
                </div>
                <Link to="/admin/nuevo">
                    <Button>Nueva publicación</Button>
                </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {proyectos.map((proyecto) => (
                    <article key={proyecto.id_proyecto} className="overflow-hidden rounded-2xl glass">
                        <img src={mediaUrl(proyecto.miniatura_url)} alt="" className="aspect-square w-full object-cover" />
                        <div className="p-3">
                            <h2 className="font-heading">{proyecto.titulo}</h2>
                            <p className="text-xs text-slate-500">{proyecto.estado_visible ? 'Publicado' : 'Oculto'}</p>
                            <div className="mt-3 flex gap-2">
                                <Link to={`/admin/${proyecto.id_proyecto}/editar`} className="cursor-pointer text-sm underline">
                                    Editar
                                </Link>
                                <button type="button" onClick={() => remove(proyecto.id_proyecto)} className="cursor-pointer text-sm text-red-400">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
