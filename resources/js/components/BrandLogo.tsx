import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function BrandLogo({
    className,
    light = false,
}: {
    className?: string;
    light?: boolean;
}) {
    return (
        <Link
            to="/"
            viewTransition
            aria-label="ARQO, ir al inicio"
            className={cn(
                'font-heading text-base font-semibold tracking-[0.22em] cursor-pointer transition-opacity duration-200 hover:opacity-70 sm:text-lg sm:tracking-[0.28em]',
                light ? 'text-white' : 'text-slate-900',
                className,
            )}
        >
            ARQO
        </Link>
    );
}
