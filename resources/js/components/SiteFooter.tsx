import { Link } from 'react-router-dom';
import type { PiePagina } from '@/types';
import { cn } from '@/lib/utils';

type Props = {
    pie?: PiePagina | null;
    tone?: 'light' | 'dark';
};

export default function SiteFooter({ pie, tone = 'light' }: Props) {
    const year = new Date().getFullYear();
    const nombre = pie?.nombre_estudio || 'ARQO';
    const dark = tone === 'dark';

    const shell = dark ? 'footer-dark' : 'glass';
    const kicker = dark ? 'text-white/50' : 'text-slate-500';
    const titulo = dark ? 'text-white' : 'text-slate-900';
    const cuerpo = dark ? 'text-white/70' : 'text-slate-600';
    const enlace = dark ? 'hover:text-white' : 'hover:text-slate-950';
    const borde = dark ? 'border-white/10' : 'border-white/40';
    const legal = dark ? 'text-white/45' : 'text-slate-500';

    return (
        <footer className="site-footer px-4 pb-8 pt-6 sm:px-5">
            <div className={cn('mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-5 py-8 sm:px-6 sm:py-10 md:px-10', shell)}>
                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className={cn('text-xs uppercase tracking-[0.28em]', kicker)}>Estudio</p>
                        <p className={cn('font-heading mt-3 text-3xl sm:text-4xl md:text-5xl', titulo)}>{nombre}</p>
                        {pie?.nota_corta ? <p className={cn('mt-4 max-w-sm', cuerpo)}>{pie.nota_corta}</p> : null}
                    </div>
                    <div className={cn('grid gap-2 text-sm', cuerpo)}>
                        {pie?.ciudad ? <p>{pie.ciudad}</p> : null}
                        {pie?.email_publico ? (
                            <a className={cn('cursor-pointer', enlace)} href={`mailto:${pie.email_publico}`}>
                                {pie.email_publico}
                            </a>
                        ) : null}
                        <div className="mt-2 flex gap-4 text-xs uppercase tracking-[0.18em]">
                            {pie?.instagram_url ? (
                                <a className={cn('cursor-pointer', enlace)} href={pie.instagram_url} target="_blank" rel="noreferrer">
                                    Instagram
                                </a>
                            ) : null}
                            {pie?.linkedin_url ? (
                                <a className={cn('cursor-pointer', enlace)} href={pie.linkedin_url} target="_blank" rel="noreferrer">
                                    LinkedIn
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className={cn('mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs', borde, legal)}>
                    <p>
                        © {year} {pie?.texto_legal || `${nombre}. Todos los derechos reservados.`}
                    </p>
                    <Link to="/portafolio" viewTransition className={cn('cursor-pointer uppercase tracking-[0.18em]', enlace)}>
                        Portafolio
                    </Link>
                </div>
            </div>
        </footer>
    );
}
