import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/BrandLogo';
import PageStage from '@/components/PageStage';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const links = [
    { to: '/admin', label: 'Publicaciones', end: true },
    { to: '/admin/nuevo', label: 'Nueva publicación' },
    { to: '/admin/servicios', label: 'Servicios' },
    { to: '/admin/recursos', label: 'Recursos' },
    { to: '/admin/categorias', label: 'Categorías' },
    { to: '/admin/estilos', label: 'Estilos' },
    { to: '/admin/perfil', label: 'Sobre mí' },
    { to: '/admin/pie', label: 'Pie de página' },
];

export default function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        if (loggingOut) return;
        setLoggingOut(true);
        setMenuOpen(false);
        try {
            await logout();
        } finally {
            setLoggingOut(false);
            navigate('/login', { replace: true });
        }
    }

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    if (loading) {
        return <div className="grid min-h-screen place-items-center text-sm uppercase tracking-[0.2em] text-slate-500">Cargando</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const nav = (
        <>
            <p className="mt-4 truncate text-xs text-slate-500">{user.email}</p>
            <nav className="mt-6 grid gap-1 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        viewTransition
                        className={({ isActive }) =>
                            cn(
                                'cursor-pointer rounded-xl px-3 py-2.5 text-sm transition-colors duration-200',
                                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white/50 hover:text-slate-950',
                            )
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
                <button
                    type="button"
                    disabled={loggingOut}
                    onClick={() => void handleLogout()}
                    className="mt-4 cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 hover:text-slate-900 disabled:opacity-50"
                >
                    {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
                </button>
            </nav>
        </>
    );

    return (
        <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
            <header className="sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-2xl glass px-3 py-2 md:hidden">
                <BrandLogo className="min-w-0 truncate" />
                <div className="flex shrink-0 items-center gap-1">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                    </button>
                </div>
            </header>

            <button
                type="button"
                aria-label="Cerrar menú"
                className={cn('admin-scrim fixed inset-0 z-40 bg-slate-900/35 md:hidden', menuOpen && 'is-open')}
                onClick={() => setMenuOpen(false)}
            />

            <aside
                className={cn(
                'admin-drawer fixed inset-y-3 left-3 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-[1.75rem] glass p-5 md:static md:z-auto md:m-4 md:h-[calc(100vh-2rem)] md:w-auto md:sticky md:top-4',
                    menuOpen && 'is-open',
                )}
            >
                <div className="hidden items-center gap-3 md:flex">
                    <BrandLogo />
                    <ThemeToggle className="ml-auto" />
                </div>
                <div className="flex items-center justify-between md:hidden">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Menú</p>
                    <button type="button" className="cursor-pointer" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>
                        <X className="h-5 w-5" aria-hidden />
                    </button>
                </div>
                {nav}
            </aside>

            <main className="min-w-0 px-4 py-5 pb-16 md:p-10">
                <PageStage>
                    <Outlet />
                </PageStage>
            </main>
        </div>
    );
}
