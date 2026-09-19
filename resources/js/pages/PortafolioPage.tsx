import { Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { useLanding } from '@/hooks/useLanding';
import { cn, mediaUrl } from '@/lib/utils';

type Tema = 'claro' | 'grafito';

const TEMA_KEY = 'arqo-portafolio-tema';

export default function PortafolioPage() {
    const data = useLanding();
    const [categoria, setCategoria] = useState<string>('todos');
    // Se lee en la inicialización para no mostrar un parpadeo del tema claro al recargar.
    const [tema, setTema] = useState<Tema>(() => (window.localStorage.getItem(TEMA_KEY) === 'grafito' ? 'grafito' : 'claro'));

    useEffect(() => {
        window.localStorage.setItem(TEMA_KEY, tema);
    }, [tema]);

    const oscuro = tema === 'grafito';

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
        <div className={oscuro ? 'portfolio-dark' : undefined}>
            <Navbar servicios={data.servicios} recursos={data.recursos} dark={oscuro} />
            <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-5 sm:pt-32">
                <p className={cn('text-xs tracking-[0.28em] uppercase', oscuro ? 'text-white/55' : 'text-slate-500')}>Portafolio</p>
                <h1
                    className={cn(
                        'font-heading mt-3 max-w-3xl text-3xl sm:text-5xl md:text-6xl',
                        oscuro ? 'text-white' : 'text-slate-900',
                    )}
                >
                    Compendio de proyectos
                </h1>
                <p className={cn('mt-5 max-w-2xl text-lg', oscuro ? 'text-white/70' : 'text-slate-600')}>
                    Cada publicación sale del panel de administración. Fotografía amplia, ficha técnica y una lectura continua del encargo.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-2">
                    {categorias.map((name) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setCategoria(name)}
                            className={cn(
                                'cursor-pointer rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors duration-200',
                                categoria === name
                                    ? oscuro
                                        ? 'bg-white text-slate-900'
                                        : 'bg-slate-900 text-white'
                                    : oscuro
                                      ? 'border border-white/15 bg-white/5 text-white/70 hover:bg-white/15'
                                      : 'glass text-slate-600 hover:bg-white/70',
                            )}
                        >
                            {name}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setTema(oscuro ? 'claro' : 'grafito')}
                        aria-label={oscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
                        title={oscuro ? 'Tema claro' : 'Tema oscuro'}
                        className={cn(
                            'ml-auto flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors duration-200',
                            oscuro
                                ? 'border border-white/15 bg-white/5 text-white/70 hover:bg-white/15'
                                : 'glass text-slate-600 hover:bg-white/70',
                        )}
                    >
                        {oscuro ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                        <span className="hidden sm:inline">{oscuro ? 'Claro' : 'Oscuro'}</span>
                    </button>
                </div>

                <div className="mt-14 columns-1 gap-10 md:columns-2">
                    {proyectos.map((proyecto) => (
                        <Link
                            key={proyecto.id_proyecto}
                            to={`/proyecto/${proyecto.id_proyecto}`}
                            viewTransition
                            className="portfolio-card group mb-10 block break-inside-avoid cursor-pointer"
                        >
                            <div
                                className={cn(
                                    'overflow-hidden rounded-[1.5rem]',
                                    oscuro ? 'border border-white/10 bg-white/5' : 'glass',
                                )}
                            >
                                <img
                                    src={mediaUrl(proyecto.miniatura_url)}
                                    alt={proyecto.titulo}
                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                            </div>
                            <div className="mt-4 flex items-baseline justify-between gap-4">
                                <h2 className={cn('font-heading text-2xl', oscuro ? 'text-white' : 'text-slate-900')}>{proyecto.titulo}</h2>
                                <span
                                    className={cn(
                                        'text-xs uppercase tracking-[0.16em]',
                                        oscuro ? 'text-white/55' : 'text-slate-500',
                                    )}
                                >
                                    {proyecto.categoria?.nombre_categoria}
                                </span>
                            </div>
                            <p className={cn('mt-1 text-sm', oscuro ? 'text-white/55' : 'text-slate-500')}>{proyecto.ubicacion}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <SiteFooter pie={data.pie} tone={oscuro ? 'dark' : 'light'} />
        </div>
    );
}
