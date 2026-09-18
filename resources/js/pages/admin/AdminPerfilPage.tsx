import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
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
        });
    }, []);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, value));
        if (avatar) payload.append('avatar', avatar);
        await api.post('/admin/perfil', payload);
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl glass p-5 sm:p-6">
            <h1 className="font-heading text-3xl">Sobre mí</h1>
            <input
                className="field mt-0"
                value={form.nombre_completo}
                onChange={(event) => setForm({ ...form, nombre_completo: event.target.value })}
                required
            />
            <input
                className="field mt-0"
                placeholder="Título profesional"
                value={form.titulo_profesional}
                onChange={(event) => setForm({ ...form, titulo_profesional: event.target.value })}
            />
            <input
                className="field mt-0"
                placeholder="Especialidad"
                value={form.especialidad}
                onChange={(event) => setForm({ ...form, especialidad: event.target.value })}
            />
            <textarea
                className="field mt-0 min-h-32 h-auto py-2"
                maxLength={1000}
                value={form.biografia}
                onChange={(event) => setForm({ ...form, biografia: event.target.value })}
            />
            <input
                className="field mt-0"
                placeholder="Años de experiencia"
                value={form.anos_experiencia}
                onChange={(event) => setForm({ ...form, anos_experiencia: event.target.value })}
            />
            <div className="file-row mt-2">
                <label className="file-field">
                    <span className="file-field-btn">Seleccionar archivo</span>
                    <span className="file-field-name">{avatar ? avatar.name : 'Ningún archivo seleccionado'}</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => setAvatar(event.target.files?.[0] ?? null)}
                    />
                </label>
                <Button type="submit" className="w-full shrink-0 sm:w-auto">
                    Guardar perfil
                </Button>
            </div>
        </form>
    );
}
