import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { PiePagina } from '@/types';

const empty: PiePagina = {
    nombre_estudio: 'ARQO',
    ciudad: '',
    email_publico: '',
    instagram_url: '',
    linkedin_url: '',
    nota_corta: '',
    texto_legal: '',
};

export default function AdminPiePage() {
    const [form, setForm] = useState<PiePagina>(empty);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        api.get('/admin/pie').then((response) => {
            const pie: PiePagina = response.data.pie;
            setForm({
                nombre_estudio: pie.nombre_estudio ?? 'ARQO',
                ciudad: pie.ciudad ?? '',
                email_publico: pie.email_publico ?? '',
                instagram_url: pie.instagram_url ?? '',
                linkedin_url: pie.linkedin_url ?? '',
                nota_corta: pie.nota_corta ?? '',
                texto_legal: pie.texto_legal ?? '',
            });
        });
    }, []);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setSaved(false);
        await api.post('/admin/pie', form);
        setSaved(true);
    }

    function set(key: keyof PiePagina, value: string) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 rounded-3xl glass p-6">
            <h1 className="font-heading text-3xl">Pie de página</h1>
            <p className="text-sm text-slate-500">Estos textos se muestran en el footer público. Déjalos vacíos si no quieres un campo.</p>
            <input className="field mt-0" placeholder="Nombre del estudio" value={form.nombre_estudio} onChange={(event) => set('nombre_estudio', event.target.value)} required />
            <input className="field mt-0" placeholder="Ciudad" value={form.ciudad ?? ''} onChange={(event) => set('ciudad', event.target.value)} />
            <input className="field mt-0" type="email" placeholder="Correo público" value={form.email_publico ?? ''} onChange={(event) => set('email_publico', event.target.value)} />
            <input className="field mt-0" placeholder="Instagram URL" value={form.instagram_url ?? ''} onChange={(event) => set('instagram_url', event.target.value)} />
            <input className="field mt-0" placeholder="LinkedIn URL" value={form.linkedin_url ?? ''} onChange={(event) => set('linkedin_url', event.target.value)} />
            <textarea className="field mt-0 min-h-24 h-auto py-2" maxLength={220} placeholder="Nota corta" value={form.nota_corta ?? ''} onChange={(event) => set('nota_corta', event.target.value)} />
            <input className="field mt-0" placeholder="Texto legal / copyright" value={form.texto_legal ?? ''} onChange={(event) => set('texto_legal', event.target.value)} />
            {saved ? <p className="text-sm text-slate-600">Guardado.</p> : null}
            <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                    Guardar pie de página
                </Button>
            </div>
        </form>
    );
}
