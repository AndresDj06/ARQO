import { Link } from 'react-router-dom';
import type { PiePagina } from '@/types';

type Props = {
    pie?: PiePagina | null;
};

export default function SiteFooter({ pie }: Props) {
    const year = new Date().getFullYear();
    const nombre = pie?.nombre_estudio || 'ARQO';

    return (
        <footer className="site-footer px-4 pb-8 pt-6 sm:px-5">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] glass px-5 py-8 sm:px-6 sm:py-10 md:px-10">
                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Estudio</p>
                        <p className="font-heading mt-3 text-3xl text-slate-900 sm:text-4xl md:text-5xl">{nombre}</p>
                        {pie?.nota_corta ? <p className="mt-4 max-w-sm text-slate-600">{pie.nota_corta}</p> : null}
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600">
                        {pie?.ciudad ? <p>{pie.ciudad}</p> : null}
                        {pie?.email_publico ? (
                            <a className="cursor-pointer hover:text-slate-950" href={`mailto:${pie.email_publico}`}>
                                {pie.email_publico}
                            </a>
                        ) : null}
                        <div className="mt-2 flex gap-4 text-xs uppercase tracking-[0.18em]">
                            {pie?.instagram_url ? (
                                <a
                                    className="cursor-pointer hover:text-slate-950"
                                    href={pie.instagram_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Instagram
                                </a>
                            ) : null}
                            {pie?.linkedin_url ? (
                                <a
                                    className="cursor-pointer hover:text-slate-950"
                                    href={pie.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    LinkedIn
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/40 pt-6 text-xs text-slate-500">
                    <p>
                        © {year} {pie?.texto_legal || `${nombre}. Todos los derechos reservados.`}
                    </p>
                    <Link to="/portafolio" viewTransition className="cursor-pointer uppercase tracking-[0.18em] hover:text-slate-950">
                        Portafolio
                    </Link>
                </div>
            </div>
        </footer>
    );
}
