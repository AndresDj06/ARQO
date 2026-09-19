import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { useLanding } from '@/hooks/useLanding';
import { mediaUrl } from '@/lib/utils';

export default function PortafolioPage() {
    const data = useLanding();
    const [categoria, setCategoria] = useState<string>('todos');

    const categorias = useMemo(() => {
        const names = new Set(
            (data?.proyectos ?? [])
                .map((proyecto) => proyecto.categoria?.nombre_categoria)
                .filter((name): name is string => Boolean(name)),
        );
        return ['todos', ...Array.from(names)];
    }, [data]);

    const proyectos = useMemo(() => {
        const list = data?.proyectos ?? [];
        if (categoria === 'todos') return list;
        return list.filter((proyecto) => proyecto.categoria?.nombre_categoria === categoria);
    }, [data, categoria]);

    if (!data) {
        return <div className="grid min-h-screen place-items-center text-sm tracking-[0.2em] uppercase text-slate-500">Cargando</div>;
    }

    return (
        <div>
            <Navbar servicios={data.servicios} recursos={data.recursos} />
            <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-5 sm:pt-32">
                <p className="text-xs tracking-[0.28em] uppercase text-slate-500">Portafolio</p>
                <h1 className="font-heading mt-3 max-w-3xl text-3xl text-slate-900 sm:text-5xl md:text-6xl">Compendio de proyectos</h1>
                <p className="mt-5 max-w-2xl text-lg text-slate-600">
                    Cada publicación sale del panel de administración. Fotografía amplia, ficha técnica y una lectura continua del encargo.
                </p>

                <div className="mt-10 flex flex-wrap gap-2">
                    {categorias.map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setCategoria(name)}
                            className={`cursor-pointer rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors duration-200 ${
                                categoria === name ? 'bg-slate-900 text-white' : 'glass text-slate-600 hover:bg-white/70'
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="mt-14 columns-1 gap-10 md:columns-2">
                    {proyectos.map((proyecto) => (
                        <Link
                            key={proyecto.id_proyecto}
                            to={`/proyecto/${proyecto.id_proyecto}`}
                            viewTransition
                            className="portfolio-card group mb-10 block break-inside-avoid cursor-pointer"
                        >
                            <div className="overflow-hidden rounded-[1.5rem] glass">
                                <img
                                    src={mediaUrl(proyecto.miniatura_url)}
                                    alt={proyecto.titulo}
                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                            </div>
                            <div className="mt-4 flex items-baseline justify-between gap-4">
                                <h2 className="font-heading text-2xl text-slate-900">{proyecto.titulo}</h2>
                                <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{proyecto.categoria?.nombre_categoria}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{proyecto.ubicacion}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <SiteFooter pie={data.pie} />
        </div>
    );
}
