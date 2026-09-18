import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type Props = {
    fallback?: string;
    /** Si true, siempre navega al fallback (p. ej. volver al home desde login). */
    homeOnly?: boolean;
};

export default function BackButton({ fallback = '/', homeOnly = false }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    function goBack() {
        if (homeOnly || location.pathname === '/login') {
            navigate(fallback, { replace: true });
            return;
        }

        if (!user && location.pathname.startsWith('/admin')) {
            navigate('/', { replace: true });
            return;
        }

        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate(fallback, { replace: true });
    }

    return (
        <button
            type="button"
            onClick={goBack}
            aria-label="Ir a la página anterior"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full glass text-slate-800 transition-transform duration-200 hover:scale-105"
        >
            <ArrowLeft className="h-4 w-4" aria-hidden />
        </button>
    );
}
