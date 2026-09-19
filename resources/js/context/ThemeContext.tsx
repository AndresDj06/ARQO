import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Tema = 'claro' | 'oscuro';

const STORAGE_KEY = 'arqo-tema';

type ThemeValue = {
    tema: Tema;
    oscuro: boolean;
    setTema: (tema: Tema) => void;
    toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

/** El script de la plantilla ya dejó el tema en <html>, así el primer render coincide. */
function temaInicial(): Tema {
    const marcado = document.documentElement.dataset.tema;
    if (marcado === 'oscuro' || marcado === 'claro') {
        return marcado;
    }

    try {
        return window.localStorage.getItem(STORAGE_KEY) === 'oscuro' ? 'oscuro' : 'claro';
    } catch {
        return 'claro';
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [tema, setTema] = useState<Tema>(temaInicial);

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.tema = tema;
        root.style.colorScheme = tema === 'oscuro' ? 'dark' : 'light';

        try {
            window.localStorage.setItem(STORAGE_KEY, tema);
        } catch {
            // Navegación privada o almacenamiento bloqueado: el tema vive solo en memoria.
        }
    }, [tema]);

    // Si el visitante cambia el tema en otra pestaña, esta lo adopta.
    useEffect(() => {
        const sync = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY && (event.newValue === 'claro' || event.newValue === 'oscuro')) {
                setTema(event.newValue);
            }
        };

        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const value = useMemo<ThemeValue>(
        () => ({
            tema,
            oscuro: tema === 'oscuro',
            setTema,
            toggle: () => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro')),
        }),
        [tema],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTema() {
    const value = useContext(ThemeContext);

    if (!value) {
        throw new Error('useTema debe usarse dentro de ThemeProvider');
    }

    return value;
}
