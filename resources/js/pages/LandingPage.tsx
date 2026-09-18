import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import MetroHero from '@/components/ui/scroll-locked-video-hero';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { useLanding } from '@/hooks/useLanding';
import { mediaUrl } from '@/lib/utils';
import { useMotionPrefs, viewportOnce } from '@/lib/motion';
import type { Proyecto, Recurso, Servicio } from '@/types';

export default function LandingPage() {
    const data = useLanding();
    const motionPrefs = useMotionPrefs();

    if (!data) {
        return <div className="grid min-h-screen place-items-center text-sm tracking-[0.2em] uppercase text-slate-500">Cargando</div>;
    }

    const featured = data.proyectos.slice(0, 3);

    return (
        <div>
            <Navbar servicios={data.servicios} recursos={data.recursos} />
            <MetroHero
                key={data.hero_video}
                videoSrc={data.hero_video}
                title="ARQO"
                tagline="Arquitectura que se revela con el terreno, la luz y el tiempo."
                scrollHint="SCROLL"
                signature={false}
                scrubDistance={1800}
            />

            <ObrasSection proyectos={featured} prefs={motionPrefs} />
            <ParaMiSection
                nombre={data.perfil?.nombre_completo}
                titulo={data.perfil?.titulo_profesional}
                bio={data.perfil?.biografia}
                avatar={data.perfil?.avatar_url}
                anos={data.perfil?.anos_experiencia}
                especialidad={data.perfil?.especialidad}
                prefs={motionPrefs}
            />
            <ServiciosSection servicios={data.servicios} prefs={motionPrefs} />
            <RecursosSection recursos={data.recursos} prefs={motionPrefs} reduce={motionPrefs.reduce} />
            <SiteFooter pie={data.pie} />
        </div>
    );
}

type Prefs = ReturnType<typeof useMotionPrefs>;

function ObrasSection({ proyectos, prefs }: { proyectos: Proyecto[]; prefs: Prefs }) {
    return (
        <section id="obras" className="section-obras mx-auto max-w-6xl px-4 py-16 sm:px-5 md:py-28">
            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={prefs.stagger}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <motion.div variants={prefs.fadeUp}>
                        <p className="text-xs tracking-[0.28em] uppercase text-slate-500">Obras</p>
                        <h2 className="font-heading mt-3 max-w-xl text-3xl text-slate-900 sm:text-4xl md:text-6xl">Selección reciente</h2>
                    </motion.div>
                    <motion.div variants={prefs.fadeUp}>
                        <Link to="/portafolio" viewTransition>
                            <Button variant="outline">Ver portafolio</Button>
                        </Link>
                    </motion.div>
                </div>
                <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-12">
                    {proyectos.map((proyecto, index) => (
                        <motion.div
                            key={proyecto.id_proyecto}
                            variants={prefs.fadeUp}
                            className={index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : 'md:col-span-12'}
                        >
                            <Link to={`/proyecto/${proyecto.id_proyecto}`} viewTransition className="group block cursor-pointer">
                                <div className="relative overflow-hidden rounded-[1.75rem] glass">
                                    <span className="pointer-events-none absolute left-4 top-4 z-10 font-heading text-4xl text-white/80 sm:left-5 sm:top-5 sm:text-5xl">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <img
                                        src={mediaUrl(proyecto.miniatura_url)}
                                        alt={proyecto.titulo}
                                        className={`media-zoom w-full object-cover ${index === 0 ? 'aspect-[16/11]' : index === 2 ? 'aspect-[16/10] md:aspect-[21/8]' : 'aspect-[4/5]'}`}
                                    />
                                </div>
                                <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                                    <p className="font-heading text-xl text-slate-900 sm:text-2xl">{proyecto.titulo}</p>
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{proyecto.ubicacion}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

function ParaMiSection({
    nombre,
    titulo,
    bio,
    avatar,
    anos,
    especialidad,
    prefs,
}: {
    nombre?: string | null;
    titulo?: string | null;
    bio?: string | null;
    avatar?: string | null;
    anos?: number | null;
    especialidad?: string | null;
    prefs: Prefs;
}) {
    return (
        <section id="sobre-mi" className="section-para-mi band-metal">
            <motion.div
                className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:gap-12 sm:px-5 sm:py-20 md:grid-cols-[0.85fr_1.15fr] md:py-24"
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={prefs.stagger}
            >
                <motion.div variants={prefs.fadeUp} className="relative">
                    <p className="para-mi-kicker mb-4 text-xs uppercase md:hidden">Para mí</p>
                    <div className="overflow-hidden rounded-[2rem] ring-1 ring-white/15">
                        <img src={mediaUrl(avatar)} alt={nombre ?? 'Arquitecto'} className="aspect-[4/5] w-full object-cover" />
                    </div>
                    {anos ? (
                        <div className="glass-metal-badge absolute -bottom-4 right-3 rounded-2xl px-4 py-3 sm:-bottom-5 sm:right-4 sm:px-5 sm:py-4">
                            <p className="para-mi-title font-heading text-2xl sm:text-3xl">{anos}</p>
                            <p className="para-mi-muted text-[11px] uppercase tracking-[0.16em]">años de práctica</p>
                        </div>
                    ) : null}
                </motion.div>
                <div>
                    <motion.p variants={prefs.fadeUp} className="para-mi-kicker hidden text-xs uppercase md:block">
                        Para mí
                    </motion.p>
                    <motion.h2 variants={prefs.fadeUp} className="para-mi-title font-heading mt-3 text-3xl sm:text-4xl md:text-6xl">
                        {nombre}
                    </motion.h2>
                    <motion.p variants={prefs.fadeUp} className="para-mi-muted mt-2 text-lg">
                        {titulo}
                    </motion.p>
                    <motion.p variants={prefs.fadeUp} className="para-mi-body mt-8 max-w-xl text-lg leading-relaxed">
                        {bio}
                    </motion.p>
                    {especialidad ? (
                        <motion.p
                            variants={prefs.fadeUp}
                            className="glass-metal-badge para-mi-muted mt-8 inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em]"
                        >
                            {especialidad}
                        </motion.p>
                    ) : null}
                </div>
            </motion.div>
        </section>
    );
}

function ServiciosSection({ servicios, prefs }: { servicios: Servicio[]; prefs: Prefs }) {
    return (
        <section id="servicios" className="section-servicios mx-auto max-w-6xl px-4 py-16 sm:px-5 md:py-28">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={prefs.stagger}
                className="md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-14"
            >
                <div className="md:sticky md:top-28 md:self-start">
                    <motion.p variants={prefs.fadeUp} className="text-xs tracking-[0.28em] uppercase text-slate-500">
                        Práctica
                    </motion.p>
                    <motion.h2 variants={prefs.fadeUp} className="font-heading mt-3 text-3xl text-slate-900 sm:text-4xl md:text-5xl">
                        Cómo trabajamos
                    </motion.h2>
                    <motion.p variants={prefs.fadeUp} className="mt-5 max-w-sm text-slate-600">
                        Un método por etapas: cada encargo avanza del concepto al detalle constructivo.
                    </motion.p>
                    <motion.p variants={prefs.fadeUp} className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {String(servicios.length).padStart(2, '0')} etapas
                    </motion.p>
                </div>

                <div className="practice-rail mt-10 md:mt-0">
                    {servicios.map((servicio, index) => (
                        <motion.article
                            id={`servicio-${servicio.id_servicio}`}
                            key={servicio.id_servicio}
                            variants={prefs.fadeUp}
                            className="practice-row"
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="practice-index">{String(index + 1).padStart(2, '0')}</span>
                                <h3 className="practice-title font-heading text-2xl text-slate-900 md:text-3xl">{servicio.nombre_servicio}</h3>
                            </div>
                            <p className="mt-4 max-w-2xl text-slate-700">{servicio.descripcion_corta}</p>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{servicio.descripcion_detallada}</p>
                        </motion.article>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

function RecursosSection({ recursos, prefs, reduce }: { recursos: Recurso[]; prefs: Prefs; reduce: boolean }) {
    const ticker = [...recursos, ...recursos].map((item) => item.titulo_recurso).join('  ·  ');

    return (
        <section id="recursos" className="section-recursos pb-16">
            {!reduce && ticker ? (
                <div className="marquee border-y border-white/50 bg-white/25 py-3">
                    <p className="marquee-track text-xs uppercase tracking-[0.28em] text-slate-500">
                        <span>{ticker} · {ticker}</span>
                        <span>{ticker} · {ticker}</span>
                    </p>
                </div>
            ) : null}
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
                <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={prefs.stagger}>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <motion.p variants={prefs.fadeUp} className="text-xs tracking-[0.28em] uppercase text-slate-500">
                                Recursos
                            </motion.p>
                            <motion.h2 variants={prefs.fadeUp} className="font-heading mt-3 text-3xl text-slate-900 sm:text-4xl md:text-5xl">
                                Archivo abierto
                            </motion.h2>
                        </div>
                        <motion.p variants={prefs.fadeUp} className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Descargas y lecturas
                        </motion.p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6">
                        {recursos.map((recurso, index) => (
                            <motion.a
                                key={recurso.id_recurso}
                                href={recurso.url_enlace}
                                target="_blank"
                                rel="noreferrer"
                                variants={prefs.fadeUp}
                                className={`archive-card archive-offset ${index % 2 === 0 ? 'archive-offset-odd' : 'archive-offset-even'} flex cursor-pointer flex-col justify-between gap-5 rounded-[1.75rem] glass p-5 sm:p-7 md:flex-row md:items-end`}
                            >
                                <span className="archive-ghost" aria-hidden>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{recurso.tipo_recurso}</p>
                                    <h3 className="font-heading mt-2 text-2xl text-slate-900 sm:text-3xl">{recurso.titulo_recurso}</h3>
                                    <p className="mt-3 max-w-xl text-slate-600">{recurso.descripcion}</p>
                                </div>
                                <span className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                                    Abrir
                                    <ArrowUpRight className="archive-arrow h-4 w-4" aria-hidden />
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
