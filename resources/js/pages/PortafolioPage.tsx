import { ArrowUpRight, LayoutGrid, Rows3 } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { useLanding } from '@/hooks/useLanding';
import { useMotionPrefs } from '@/lib/motion';
import { mediaUrl } from '@/lib/utils';
import type { Proyecto } from '@/types';

type Vista = 'indice' | 'mosaico';

export default function PortafolioPage() {
    const data = useLanding();
    const prefs = useMotionPrefs();
    const [categoria, setCategoria] = useState('todos');
    const [vista, setVista] = useState<Vista>('indice');
    const [hovered, setHovered] = useState<Proyecto | null>(null);
    const [puedeSeguirCursor, setPuedeSeguirCursor] = useState(false);

    const { scrollYProgress } = useScroll();
    const progreso = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const previewX = useSpring(cursorX, { stiffness: 220, damping: 26, mass: 0.55 });
    const previewY = useSpring(cursorY, { stiffness: 220, damping: 26, mass: 0.55 });

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
        return <div className="portfolio-page grid place-items-center text-sm tracking-[0.2em] uppercase text-slate-400">Cargando</div>;
    }

    return (
        <div className="portfolio-page">
            <motion.div className="pf-progress" style={{ scaleX: progreso }} aria-hidden />
            <Navbar servicios={data.servicios} recursos={data.recursos} dark />

            <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-5 sm:pt-32">
                {/* Portada del índice */}
                <header>
                    <motion.p
                        className="pf-kicker text-xs uppercase"
                        initial={prefs.reduce ? undefined : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Portafolio · Índice de obras
                    </motion.p>
                    <motion.h1
                        className="pf-title font-heading mt-4 max-w-4xl text-4xl leading-[1.02] sm:text-6xl md:text-[5.5rem]"
                        initial={prefs.reduce ? undefined : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.06 }}
                    >
                        Archivo de
                        <span className="pf-muted"> obra construida</span>
                    </motion.h1>

                    <div className="pf-hairline mt-10" />

                    <div className="mt-8 flex flex-wrap items-start justify-between gap-8">
                        <p className="pf-body max-w-md text-base sm:text-lg">
                            Un registro continuo: cada encargo se documenta con su ficha técnica, su emplazamiento y la serie fotográfica
                            completa.
                        </p>
                        <dl className="flex flex-wrap gap-8">
                            <div className="pf-stat">
                                <dt className="pf-muted text-[11px] uppercase tracking-[0.2em]">Obras</dt>
                                <dd className="pf-title font-heading mt-1 text-3xl">{String(proyectos.length).padStart(2, '0')}</dd>
                            </div>
                            <div className="pf-stat">
                                <dt className="pf-muted text-[11px] uppercase tracking-[0.2em]">Categorías</dt>
                                <dd className="pf-title font-heading mt-1 text-3xl">{String(categorias.length - 1).padStart(2, '0')}</dd>
                            </div>
                            <div className="pf-stat">
                                <dt className="pf-muted text-[11px] uppercase tracking-[0.2em]">Estilos</dt>
                                <dd className="pf-title font-heading mt-1 text-3xl">{String(estilos).padStart(2, '0')}</dd>
                            </div>
                        </dl>
                    </div>
                </header>

                {/* Controles adheridos */}
                <div className="pf-bar mt-12 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
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
                        <div className="flex items-center gap-1 rounded-full border border-white/10 p-1">
                            <button
                                type="button"
                                aria-label="Ver como índice"
                                onClick={() => setVista('indice')}
                                className={`pf-toggle p-2 ${vista === 'indice' ? 'is-active' : ''}`}
                            >
                                <Rows3 className="h-4 w-4" aria-hidden />
                            </button>
                            <button
                                type="button"
                                aria-label="Ver como mosaico"
                                onClick={() => setVista('mosaico')}
                                className={`pf-toggle p-2 ${vista === 'mosaico' ? 'is-active' : ''}`}
                            >
                                <LayoutGrid className="h-4 w-4" aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {vista === 'indice' ? (
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
                                        <ArrowUpRight className="pf-row-arrow h-5 w-5 text-white/70" aria-hidden />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.section>
                    ) : (
                        <motion.section
                            key={`mosaico-${categoria}`}
                            className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-12"
                            initial={prefs.reduce ? undefined : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefs.reduce ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.34 }}
                        >
                            {visibles.map((proyecto, index) => {
                                const ritmo = index % 5;
                                const ancho =
                                    ritmo === 0
                                        ? 'md:col-span-7'
                                        : ritmo === 1
                                          ? 'md:col-span-5'
                                          : ritmo === 2
                                            ? 'md:col-span-5'
                                            : ritmo === 3
                                              ? 'md:col-span-7'
                                              : 'md:col-span-12';
                                const alto = ritmo === 4 ? 'aspect-[21/9]' : ritmo % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[4/5]';

                                return (
                                    <motion.div
                                        key={proyecto.id_proyecto}
                                        className={ancho}
                                        initial={prefs.reduce ? undefined : { opacity: 0, y: 22 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: prefs.reduce ? 0 : index * 0.06 }}
                                    >
                                        <Link to={`/proyecto/${proyecto.id_proyecto}`} viewTransition className="pf-tile block cursor-pointer">
                                            <img
                                                src={mediaUrl(proyecto.miniatura_url)}
                                                alt={proyecto.titulo}
                                                className={`w-full object-cover ${alto}`}
                                            />
                                            <div className="pf-tile-cap">
                                                <div className="pf-tile-cap-inner">
                                                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                                                        {String(index + 1).padStart(2, '0')} · {proyecto.categoria?.nombre_categoria}
                                                    </p>
                                                    <h2 className="font-heading mt-1 text-2xl text-white sm:text-3xl">{proyecto.titulo}</h2>
                                                    <p className="mt-1 text-sm text-white/70">{proyecto.ubicacion}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.section>
                    )}
                </AnimatePresence>

                {visibles.length === 0 ? (
                    <p className="pf-muted mt-16 text-sm uppercase tracking-[0.2em]">Sin obras en esta categoría</p>
                ) : null}
            </main>

            {/* Vista previa flotante, solo en escritorio con puntero fino */}
            <AnimatePresence>
                {puedeSeguirCursor && hovered && vista === 'indice' ? (
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

            <SiteFooter pie={data.pie} tone="dark" />
        </div>
    );
}
