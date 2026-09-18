import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import axios from 'axios';
import { api, csrfCookie, resetCsrfCookie } from '@/lib/api';

type User = { id: number; name: string; email: string };

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loginErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return 'No fue posible iniciar sesión.';
    }

    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.errors?.email?.[0]) {
        return data.errors.email[0];
    }
    if (data?.message) {
        return data.message;
    }
    if (error.response?.status === 419) {
        return 'La sesión expiró. Recarga la página e inténtalo de nuevo.';
    }
    if (error.response?.status === 404) {
        return 'No se encontró la ruta de acceso. Abre ARQO desde http://localhost/arqo';
    }

    return 'No fue posible iniciar sesión.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        csrfCookie()
            .then(() => api.get('/auth/me'))
            .then((response) => setUser(response.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            login: async (email, password) => {
                await csrfCookie();
                const response = await api.post('/auth/login', { email, password });
                await resetCsrfCookie();
                setUser(response.data.user);
            },
            logout: async () => {
                try {
                    await csrfCookie();
                    await api.post('/auth/logout');
                } catch {
                    // La sesión pudo expirar; igual limpiamos el cliente.
                } finally {
                    setUser(null);
                }
            },
        }),
        [user, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export { loginErrorMessage };
