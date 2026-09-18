import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { loginErrorMessage, useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { user, loading, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!loading && user) {
        return <Navigate to="/admin" replace />;
    }

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (caught) {
            setError(loginErrorMessage(caught));
        }
    }

    return (
        <div className="grid min-h-screen place-items-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-6 flex items-center justify-between">
                    <BackButton homeOnly fallback="/" />
                    <BrandLogo />
                </div>
                <form onSubmit={onSubmit} className="rounded-3xl glass p-6 sm:p-8">
                    <p className="text-xs tracking-[0.28em] uppercase text-slate-500">Panel</p>
                    <h1 className="font-heading mt-2 text-3xl text-slate-900">Entrar a ARQO</h1>
                    <label className="mt-8 block text-sm text-slate-600">
                        Correo
                        <input
                            className="field"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            autoComplete="username"
                            placeholder="tu@correo.com"
                            required
                        />
                    </label>
                    <label className="mt-5 block text-sm text-slate-600">
                        Contraseña
                        <input
                            className="field"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                        />
                    </label>
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    <Button type="submit" className="mt-8 w-full">
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}
