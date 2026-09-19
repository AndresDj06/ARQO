import { Moon, Sun } from 'lucide-react';
import { useTema } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    /** Sobre el video del hero el icono va en blanco. */
    light?: boolean;
};

export default function ThemeToggle({ className, light = false }: Props) {
    const { oscuro, toggle } = useTema();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={oscuro}
            aria-label={oscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
            title={oscuro ? 'Tema claro' : 'Tema oscuro'}
            className={cn(
                'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200',
                light ? 'text-white/90 hover:bg-white/15' : 'text-slate-700 hover:bg-white/50',
                className,
            )}
        >
            {oscuro ? <Sun className="h-[1.1rem] w-[1.1rem]" aria-hidden /> : <Moon className="h-[1.1rem] w-[1.1rem]" aria-hidden />}
        </button>
    );
}
