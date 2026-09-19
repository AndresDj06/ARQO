import { ChevronDown, CircleUser, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import ThemeToggle from '@/components/ThemeToggle';
import type { Recurso, Servicio } from '@/types';
import { cn } from '@/lib/utils';

type Props = {
    servicios: Servicio[];
    recursos: Recurso[];
};

export default function Navbar({ servicios, recursos }: Props) {
    const [open, setOpen] = useState<'servicios' | 'recursos' | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const overHero = location.pathname === '/' && !scrolled;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setOpen(null);
        setMenuOpen(false);
    }, [location.pathname, location.hash]);

    const item = cn(
        'cursor-pointer text-[12px] tracking-[0.18em] uppercase transition-colors duration-200',
        overHero ? 'text-white/85 hover:text-white' : 'text-slate-600 hover:text-slate-950',
    );

    const accountClass = cn(
        'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200',
        overHero ? 'text-white/90 hover:bg-white/15' : 'text-slate-700 hover:bg-white/50',
    );

    const sheetItem = 'block cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700';

    return (
        <header className="site-nav fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
            <nav className={cn('mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2.5 sm:px-5 sm:py-3', overHero ? 'glass-nav-hero' : 'glass-nav')}>
                <BrandLogo light={overHero} />
                <div className="flex items-center gap-1 sm:gap-2 md:hidden">
                    <ThemeToggle light={overHero} />
                    <button
                        type="button"
                        className={accountClass}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        onClick={() => setMenuOpen((value) => !value)}
                    >
                        {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                    </button>
                    <NavLink to="/login" viewTransition aria-label="Iniciar sesión" className={accountClass}>
                        <CircleUser className="h-5 w-5" aria-hidden />
                    </NavLink>
                </div>
                <div className="hidden items-center gap-6 md:flex">
                    <Link to="/#obras" className={item}>
                        Obras
                    </Link>
                    <NavLink to="/portafolio" viewTransition className={item}>
                        Portafolio
                    </NavLink>
                    <Link to="/#sobre-mi" className={item}>
                        Para mí
                    </Link>
                    {servicios.length > 0 && (
                        <div className="relative">
                            <button type="button" className={cn(item, 'flex items-center gap-1')} onClick={() => setOpen(open === 'servicios' ? null : 'servicios')}>
                                Práctica <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                            </button>
                            {open === 'servicios' && (
                                <div className="absolute right-0 mt-3 min-w-56 rounded-2xl glass p-2">
                                    {servicios.map((entry) => (
                                        <Link
                                            key={entry.id_servicio}
                                            to={`/#servicio-${entry.id_servicio}`}
                                            className="block cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:bg-white/50"
                                        >
                                            {entry.nombre_servicio}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {recursos.length > 0 && (
                        <div className="relative">
                            <button type="button" className={cn(item, 'flex items-center gap-1')} onClick={() => setOpen(open === 'recursos' ? null : 'recursos')}>
                                Recursos <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                            </button>
                            {open === 'recursos' && (
                                <div className="absolute right-0 mt-3 min-w-56 rounded-2xl glass p-2">
                                    {recursos.map((entry) => (
                                        <a
                                            key={entry.id_recurso}
                                            href={entry.url_enlace}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:bg-white/50"
                                        >
                                            {entry.titulo_recurso}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <ThemeToggle light={overHero} />
                    <NavLink to="/login" viewTransition aria-label="Iniciar sesión" className={accountClass}>
                        <CircleUser className="h-5 w-5" aria-hidden />
                    </NavLink>
                </div>
            </nav>
            <div className={cn('nav-sheet mx-auto mt-2 max-w-6xl rounded-[1.5rem] glass md:hidden', menuOpen && 'is-open')}>
                <div className="grid gap-1 p-3">
                    <Link to="/#obras" className={sheetItem}>
                        Obras
                    </Link>
                    <NavLink to="/portafolio" viewTransition className={sheetItem}>
                        Portafolio
                    </NavLink>
                    <Link to="/#sobre-mi" className={sheetItem}>
                        Para mí
                    </Link>
                    {servicios.map((entry) => (
                        <Link key={entry.id_servicio} to={`/#servicio-${entry.id_servicio}`} className={sheetItem}>
                            {entry.nombre_servicio}
                        </Link>
                    ))}
                    {recursos.map((entry) => (
                        <a key={entry.id_recurso} href={entry.url_enlace} target="_blank" rel="noreferrer" className={sheetItem}>
                            {entry.titulo_recurso}
                        </a>
                    ))}
                </div>
            </div>
        </header>
    );
}
