import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { mediaUrl } from '@/lib/utils';
import type { Perfil } from '@/types';

export default function AdminPerfilPage() {
    const [form, setForm] = useState({
        nombre_completo: '',
        titulo_profesional: '',
        especialidad: '',
        biografia: '',
        anos_experiencia: '',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/perfil').then((response) => {
            const perfil: Perfil = response.data.perfil;
            setForm({
                nombre_completo: perfil.nombre_completo ?? '',
                titulo_profesional: perfil.titulo_profesional ?? '',
                especialidad: perfil.especialidad ?? '',
                biografia: perfil.biografia ?? '',
                anos_experiencia: perfil.anos_experiencia?.toString() ?? '',
            });
            setPreview(mediaUrl(perfil.avatar_url));
        });
    }, []);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        setSaved(false);
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, value));
        if (avatar) payload.append('avatar', avatar);

        try {
            const response = await api.post('/admin/perfil', payload);
            const perfil: Perfil = response.data.perfil;
            setPreview(mediaUrl(perfil.avatar_url));
            setAvatar(null);
            setSaved(true);
        } catch (caught) {
            if (axios.isAxiosError(caught)) {
                const message = (caught.response?.data as { message?: string })?.message;
                setError(message ?? 'No se pudo guardar el perfil.');
                return;
            }
            setError('No se pudo guardar el perfil.');
        }
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl glass p-5 sm:p-6">
            <h1 className="font-heading text-3xl">Sobre mí</h1>
            {preview ? (
                <img src={preview} alt="Vista previa del avatar" className="aspect-square w-32 rounded-2xl object-cover" />
            ) : null}
            <label className="text-sm text-slate-600">
                Nombre completo
                <input
                    className="field mt-2"
                    value={form.nombre_completo}
                    onChange={(event) => setForm({ ...form, nombre_completo: event.target.value })}
                    required
                />
            </label>
            <label className="text-sm text-slate-600">
                Título profesional
                <input
                    className="field mt-2"
                    placeholder="Ej. Arquitecta"
                    value={form.titulo_profesional}
                    onChange={(event) => setForm({ ...form, titulo_profesional: event.target.value })}
                />
            </label>
            <label className="text-sm text-slate-600">
                Especialidad
                <input
                    className="field mt-2"
                    placeholder="Ej. Residencial y paisajismo"
                    value={form.especialidad}
                    onChange={(event) => setForm({ ...form, especialidad: event.target.value })}
                />
            </label>
            <label className="text-sm text-slate-600">
                Biografía
                <textarea
                    className="field mt-2 min-h-32 h-auto py-2"
                    placeholder="Texto público del apartado Para mí"
                    maxLength={1000}
                    value={form.biografia}
                    onChange={(event) => setForm({ ...form, biografia: event.target.value })}
                />
            </label>
            <label className="text-sm text-slate-600">
                Años de experiencia
                <input
                    className="field mt-2"
                    inputMode="numeric"
                    placeholder="Ej. 12"
                    value={form.anos_experiencia}
                    onChange={(event) => setForm({ ...form, anos_experiencia: event.target.value })}
                />
            </label>
            <p className="text-sm text-slate-600">Foto del arquitecto</p>
            <div className="file-row">
                <label className="file-field">
                    <span className="file-field-btn">Seleccionar archivo</span>
                    <span className="file-field-name">{avatar ? avatar.name : 'Ningún archivo seleccionado'}</span>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setAvatar(file);
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </label>
                <Button type="submit" className="w-full shrink-0 sm:w-auto">
                    Guardar perfil
                </Button>
            </div>
            {saved ? <p className="text-sm text-slate-600">Perfil guardado. Recarga la home para ver el avatar público.</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>
    );
}
