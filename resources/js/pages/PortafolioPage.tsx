import { ArrowUpRight, LayoutGrid, Moon, Rows3, Sun } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { useLanding } from '@/hooks/useLanding';
import { useMotionPrefs } from '@/lib/motion';
import { mediaUrl } from '@/lib/utils';
import type { Proyecto } from '@/types';

type Vista = 'galeria' | 'indice';
type Tema = 'arena' | 'grafito';

const TEMA_KEY = 'arqo-portafolio-tema';

/**
 * Ritmo de la galería: cada lámina ocupa un lugar distinto de la retícula de 12
 * columnas, así la lectura avanza en pares desfasados y respiros a todo el ancho.
 */
const LAMINAS = [
    { area: 'md:col-span-8 md:col-start-1', proporcion: 'md:aspect-[16/10]', desfase: '' },
    { area: 'md:col-span-4 md:col-start-9', proporcion: 'md:aspect-[3/4]', desfase: 'md:mt-20' },
    { area: 'md:col-span-5 md:col-start-1', proporcion: 'md:aspect-[4/5]', desfase: '' },
    { area: 'md:col-span-6 md:col-start-7', proporcion: 'md:aspect-[4/3]', desfase: 'md:mt-28' },
    { area: 'md:col-span-12 md:col-start-1', proporcion: 'md:aspect-[21/9]', desfase: '' },
    { area: 'md:col-span-7 md:col-start-4', proporcion: 'md:aspect-[16/11]', desfase: '' },
] as const;

export default function PortafolioPage() {
    const data = useLanding();
    const prefs = useMotionPrefs();
    const [categoria, setCategoria] = useState('todos');
    const [vista, setVista] = useState<Vista>('galeria');
    // Se lee en la inicialización para no mostrar un parpadeo del tema claro al recargar.
    const [tema, setTema] = useState<Tema>(() => (window.localStorage.getItem(TEMA_KEY) === 'grafito' ? 'grafito' : 'arena'));
    const [hovered, setHovered] = useState<Proyecto | null>(null);
    const [puedeSeguirCursor, setPuedeSeguirCursor] = useState(false);

    const { scrollYProgress } = useScroll();
    const progreso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const previewX = useSpring(cursorX, { stiffness: 220, damping: 26, mass: 0.55 });
    const previewY = useSpring(cursorY, { stiffness: 220, damping: 26, mass: 0.55 });

    useEffect(() => {
        window.localStorage.setItem(TEMA_KEY, tema);
    }, [tema]);

    useEffect(() => {
        const media = window.matchMedia('(hover: hover) and (min-width: 1024px)');
        const sync = () => setPuedeSeguirCursor(media.matches && !prefs.reduce);
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, [prefs.reduce]);

    const proyectos = data?.proyectos ?? [];

    const categorias = useMemo(() => {
        const nombres = new Set(
            proyectos.map((proyecto) => proyecto.categoria?.nombre_categoria).filter((nombre): nombre is string => Boolean(nombre)),
        );
        return ['todos', ...Array.from(nombres)];
    }, [proyectos]);

    const visibles = useMemo(() => {
        if (categoria === 'todos') return proyectos;
        return proyectos.filter((proyecto) => proyecto.categoria?.nombre_categoria === categoria);
    }, [proyectos, categoria]);

    const estilos = useMemo(
        () => new Set(proyectos.map((proyecto) => proyecto.estilo?.nombre_estilo).filter(Boolean)).size,
        [proyectos],
    );

    if (!data) {
        return <div className="portfolio-page grid place-items-center text-sm uppercase tracking-[0.2em]" data-tema={tema}>Cargando</div>;
    }

    const [apertura, ...resto] = visibles;
    const galeria = vista === 'galeria';

    return (
        <div className="portfolio-page" data-tema={tema}>
            <motion.div className="pf-progress" style={{ scaleX: progreso }} aria-hidden />
            <Navbar servicios={data.servicios} recursos={data.recursos} dark={tema === 'grafito'} />

            {/* Portada breve: el protagonismo es de la imagen que viene debajo */}
            <header className="mx-auto max-w-6xl px-4 pt-28 sm:px-5 sm:pt-32">
                <motion.p
                    className="pf-kicker text-xs uppercase"
                    initial={prefs.reduce ? undefined : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Portafolio
                </motion.p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                    <motion.h1
                        className="pf-title font-heading max-w-2xl text-4xl leading-[1.04] sm:text-5xl md:text-6xl"
                        initial={prefs.reduce ? undefined : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                    >
                        Obra construida
                    </motion.h1>
                    <dl className="flex flex-wrap gap-6">
                        <div className="pf-stat">
                            <dt className="pf-muted text-[10px] uppercase tracking-[0.2em]">Obras</dt>
                            <dd className="pf-title font-heading mt-1 text-2xl">{String(proyectos.length).padStart(2, '0')}</dd>
                        </div>
                        <div className="pf-stat">
                            <dt className="pf-muted text-[10px] uppercase tracking-[0.2em]">Categorías</dt>
                            <dd className="pf-title font-heading mt-1 text-2xl">{String(categorias.length - 1).padStart(2, '0')}</dd>
                        </div>
                        <div className="pf-stat">
                            <dt className="pf-muted text-[10px] uppercase tracking-[0.2em]">Estilos</dt>
                            <dd className="pf-title font-heading mt-1 text-2xl">{String(estilos).padStart(2, '0')}</dd>
                        </div>
                    </dl>
                </div>
                <div className="pf-hairline mt-7" />
            </header>

            {/* Apertura a sangre completa */}
            {apertura ? (
                <motion.div
                    className="mt-8 px-0"
                    initial={prefs.reduce ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <Link
                        to={`/proyecto/${apertura.id_proyecto}`}
                        viewTransition
                        className="pf-opening h-[58vh] min-h-[22rem] cursor-pointer sm:h-[72vh]"
                    >
                        <img src={mediaUrl(apertura.miniatura_url)} alt={apertura.titulo} />
                        <div className="pf-opening-veil" />
                        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-5 sm:pb-12">
                            <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">
                                Obra destacada · {apertura.categoria?.nombre_categoria}
                            </p>
                            <h2 className="font-heading mt-3 text-4xl text-white sm:text-6xl md:text-7xl">{apertura.titulo}</h2>
                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-white/75">
                                <span>{apertura.ubicacion}</span>
                                {apertura.superficie_m2 ? <span>{apertura.superficie_m2} m²</span> : null}
                                {apertura.estilo?.nombre_estilo ? <span>{apertura.estilo.nombre_estilo}</span> : null}
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ) : null}

            <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-5">
                {/* Controles adheridos */}
                <div className="pf-bar mt-10 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categorias.map((nombre) => (
                            <button
                                key={nombre}
                                type="button"
                                onClick={() => setCategoria(nombre)}
                                className={`pf-chip px-4 py-2 text-[11px] uppercase tracking-[0.16em] ${categoria === nombre ? 'is-active' : ''}`}
                            >
                                {nombre}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="pf-muted text-[11px] uppercase tracking-[0.2em]">
                            {String(visibles.length).padStart(2, '0')} / {String(proyectos.length).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: 'var(--pf-line)' }}>
                            <button
                                type="button"
                                aria-label="Ver como galería"
                                aria-pressed={galeria}
                                onClick={() => setVista('galeria')}
                                className={`pf-toggle p-2 ${galeria ? 'is-active' : ''}`}
                            >
                                <LayoutGrid className="h-4 w-4" aria-hidden />
                            </button>
                            <button
                                type="button"
                                aria-label="Ver como índice"
                                aria-pressed={!galeria}
                                onClick={() => setVista('indice')}
                                className={`pf-toggle p-2 ${!galeria ? 'is-active' : ''}`}
                            >
                                <Rows3 className="h-4 w-4" aria-hidden />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTema(tema === 'arena' ? 'grafito' : 'arena')}
                            aria-label={tema === 'arena' ? 'Activar tema oscuro' : 'Activar tema claro'}
                            title={tema === 'arena' ? 'Tema oscuro' : 'Tema claro'}
                            className="pf-chip flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
                        >
                            {tema === 'arena' ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
                            <span className="hidden sm:inline">{tema === 'arena' ? 'Oscuro' : 'Claro'}</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {galeria ? (
                        <motion.section
                            key={`galeria-${categoria}`}
                            className="mt-12 grid gap-8 sm:gap-10 md:grid-cols-12 md:items-start md:gap-x-6 md:gap-y-4"
                            initial={prefs.reduce ? undefined : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefs.reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.34 }}
                        >
                            {resto.map((proyecto, index) => {
                                const lamina = LAMINAS[index % LAMINAS.length];

                                return (
                                    <motion.div
                                        key={proyecto.id_proyecto}
                                        className={`${lamina.area} ${lamina.desfase}`}
                                        initial={prefs.reduce ? undefined : { opacity: 0, y: 26 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.15 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Link to={`/proyecto/${proyecto.id_proyecto}`} viewTransition className="pf-plate cursor-pointer">
                                            <div className={`pf-frame aspect-[4/3] ${lamina.proporcion}`}>
                                                <span className="pf-plate-num font-heading text-lg sm:text-xl">
                                                    {String(index + 2).padStart(2, '0')}
                                                </span>
                                                <img src={mediaUrl(proyecto.miniatura_url)} alt={proyecto.titulo} />
                                            </div>
                                            <div className="pf-plate-cap">
                                                <div>
                                                    <h2 className="pf-plate-title font-heading text-xl sm:text-2xl">{proyecto.titulo}</h2>
                                                    <p className="pf-muted mt-0.5 text-sm">{proyecto.ubicacion}</p>
                                                </div>
                                                <span className="pf-muted shrink-0 text-[10px] uppercase tracking-[0.18em]">
                                                    {proyecto.categoria?.nombre_categoria}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.section>
                    ) : (
                        <motion.section
                            key={`indice-${categoria}`}
                            className="mt-12"
                            initial={prefs.reduce ? undefined : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefs.reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.34 }}
                            onMouseLeave={() => setHovered(null)}
                            onMouseMove={(event) => {
                                cursorX.set(event.clientX + 28);
                                cursorY.set(event.clientY - 110);
                            }}
                        >
                            {visibles.map((proyecto, index) => (
                                <motion.div
                                    key={proyecto.id_proyecto}
                                    initial={prefs.reduce ? undefined : { opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: prefs.reduce ? 0 : index * 0.05 }}
                                >
                                    <Link
                                        to={`/proyecto/${proyecto.id_proyecto}`}
                                        viewTransition
                                        onMouseEnter={() => setHovered(proyecto)}
                                        className="pf-row cursor-pointer md:grid-cols-[4.5rem_minmax(0,1fr)_9rem_8rem_1.5rem]"
                                    >
                                        <span className="pf-num font-heading text-sm md:text-base">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="pf-row-title">
                                            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">{proyecto.titulo}</h2>
                                            <p className="pf-muted mt-1 text-sm">{proyecto.ubicacion}</p>
                                        </div>
                                        {/* En móvil van en una sola línea; en escritorio son columnas del índice. */}
                                        <div className="mt-1 flex items-center gap-3 md:contents">
                                            <span className="pf-muted text-[11px] uppercase tracking-[0.18em]">
                                                {proyecto.categoria?.nombre_categoria}
                                            </span>
                                            <span className="pf-muted text-[11px] uppercase tracking-[0.18em]">
                                                {proyecto.superficie_m2 ? `${proyecto.superficie_m2} m²` : proyecto.estilo?.nombre_estilo}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="pf-row-arrow h-5 w-5" aria-hidden />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.section>
                    )}
                </AnimatePresence>

                {visibles.length === 0 ? (
                    <p className="pf-muted mt-16 text-sm uppercase tracking-[0.2em]">Sin obras en esta categoría</p>
                ) : null}
            </main>

            {/* Vista previa flotante del índice, solo en escritorio con puntero fino */}
            <AnimatePresence>
                {puedeSeguirCursor && hovered && !galeria ? (
                    <motion.div
                        className="pf-cursor-preview"
                        style={{ x: previewX, y: previewY }}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.22 }}
                    >
                        <img src={mediaUrl(hovered.miniatura_url)} alt="" className="aspect-[4/3] w-full object-cover" />
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <SiteFooter pie={data.pie} tone={tema === 'grafito' ? 'dark' : 'light'} />
        </div>
    );
}
