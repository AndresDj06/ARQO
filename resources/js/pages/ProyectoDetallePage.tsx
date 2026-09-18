import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { api } from '@/lib/api';
import { mediaUrl, whatsappHref } from '@/lib/utils';
import { useLanding } from '@/hooks/useLanding';
import type { Proyecto } from '@/types';

export default function ProyectoDetallePage() {
    const { id } = useParams();
    const landing = useLanding();
    const [proyecto, setProyecto] = useState<Proyecto | null>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        api.get(`/public/proyectos/${id}`).then((response) => {
            setProyecto(response.data.proyecto);
            setIndex(0);
        });
    }, [id]);

    const slides = useMemo(() => {
        if (!proyecto) return [];
        const list = proyecto.imagenes.map((item) => item.imagen_url);
        if (proyecto.miniatura_url && !list.includes(proyecto.miniatura_url)) {
            list.unshift(proyecto.miniatura_url);
        }
        return list;
    }, [proyecto]);

    const related = (landing?.proyectos ?? []).filter((item) => item.id_proyecto !== proyecto?.id_proyecto).slice(0, 3);

    if (!proyecto || !landing) {
        return <div className="grid min-h-screen place-items-center text-sm tracking-[0.2em] uppercase text-slate-500">Cargando</div>;
    }

    const current = slides[index] ?? proyecto.miniatura_url;

    return (
        <div>
            <Navbar servicios={landing.servicios} recursos={landing.recursos} />
            <article className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-5 sm:pt-32">
                <Link to="/portafolio" viewTransition className="cursor-pointer text-xs uppercase tracking-[0.2em] text-slate-500">
                    Portafolio
                </Link>
                <p className="mt-8 text-xs uppercase tracking-[0.22em] text-slate-500">
                    {proyecto.categoria?.nombre_categoria ?? 'Proyecto'} · {proyecto.estilo?.nombre_estilo}
                </p>
                <h1 className="font-heading mt-3 max-w-4xl text-4xl text-slate-900 sm:text-5xl md:text-7xl">{proyecto.titulo}</h1>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-xl">{proyecto.descripcion}</p>

                <dl className="mt-10 grid gap-6 rounded-3xl glass p-6 sm:grid-cols-3">
                    <div>
                        <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Ubicación</dt>
                        <dd className="mt-2 text-slate-900">{proyecto.ubicacion || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Categoría</dt>
                        <dd className="mt-2 text-slate-900">{proyecto.categoria?.nombre_categoria || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Resumen técnico</dt>
                        <dd className="mt-2 text-slate-900">{proyecto.resumen_tecnico || 'Ficha en desarrollo'}</dd>
                    </div>
                </dl>

                <div className="relative mt-12 overflow-hidden rounded-[2rem] glass">
                    {proyecto.video_url ? (
                        <video src={proyecto.video_url} className="h-[70vh] w-full object-cover" controls muted playsInline />
                    ) : (
                        <img src={mediaUrl(current)} alt={proyecto.titulo} className="h-[70vh] w-full object-cover" />
                    )}
                    {slides.length > 1 && !proyecto.video_url && (
                        <>
                            <button
                                type="button"
                                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full glass p-3"
                                onClick={() => setIndex((value) => (value - 1 + slides.length) % slides.length)}
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full glass p-3"
                                onClick={() => setIndex((value) => (value + 1) % slides.length)}
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight />
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-16 grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <h2 className="font-heading text-3xl text-slate-900">Highlights del proyecto</h2>
                        {proyecto.alcance_entregables && <p className="mt-5 text-lg leading-relaxed text-slate-600">{proyecto.alcance_entregables}</p>}
                        {(proyecto.terreno_frente_m || proyecto.terreno_fondo_m) && (
                            <p className="mt-6 text-slate-600">
                                Terreno {proyecto.terreno_frente_m ?? '—'} m frente × {proyecto.terreno_fondo_m ?? '—'} m fondo
                            </p>
                        )}
                    </div>
                    <aside className="rounded-3xl glass p-7">
                        <h2 className="text-xs uppercase tracking-[0.22em] text-slate-500">Siguiente paso</h2>
                        <p className="mt-3 text-slate-600">Si este encargo se acerca a lo que necesitas, conversemos sobre el sitio y el alcance.</p>
                        <a
                            href={whatsappHref(landing.whatsapp, proyecto.titulo)}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800"
                        >
                            Me interesa este proyecto
                        </a>
                    </aside>
                </div>

                {related.length > 0 && (
                    <section className="mt-24">
                        <h2 className="font-heading text-3xl text-slate-900">Más obra</h2>
                        <div className="mt-8 grid gap-6 md:grid-cols-3">
                            {related.map((item) => (
                                <Link key={item.id_proyecto} to={`/proyecto/${item.id_proyecto}`} viewTransition className="group cursor-pointer">
                                    <img src={mediaUrl(item.miniatura_url)} alt={item.titulo} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                                    <p className="mt-3 font-heading text-lg text-slate-900">{item.titulo}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
            <SiteFooter pie={landing.pie} />
        </div>
    );
}
