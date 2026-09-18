import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { Recurso } from '@/types';

const empty = {
    titulo_recurso: '',
    tipo_recurso: '',
    descripcion: '',
    url_enlace: '',
    estado_activo: true,
};

export default function AdminRecursosPage() {
    const [items, setItems] = useState<Recurso[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<number | null>(null);

    function load() {
        api.get('/admin/recursos').then((response) => setItems(response.data.recursos));
    }

    useEffect(() => {
        load();
    }, []);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        if (editing) {
            await api.put(`/admin/recursos/${editing}`, form);
        } else {
            await api.post('/admin/recursos', form);
        }
        setForm(empty);
        setEditing(null);
        load();
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
                <h1 className="font-heading text-3xl">Recursos</h1>
                <div className="mt-6 space-y-3">
                    {items.map((item) => (
                        <article key={item.id_recurso} className="rounded-2xl glass p-4">
                            <h2 className="font-heading">{item.titulo_recurso}</h2>
                            <p className="text-sm text-slate-500">{item.url_enlace}</p>
                            <div className="mt-3 flex gap-3 text-sm">
                                <button
                                    type="button"
                                    className="cursor-pointer underline"
                                    onClick={() => {
                                        setEditing(item.id_recurso);
                                        setForm({
                                            titulo_recurso: item.titulo_recurso,
                                            tipo_recurso: item.tipo_recurso ?? '',
                                            descripcion: item.descripcion ?? '',
                                            url_enlace: item.url_enlace,
                                            estado_activo: item.estado_activo,
                                        });
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="cursor-pointer text-red-400"
                                    onClick={async () => {
                                        await api.delete(`/admin/recursos/${item.id_recurso}`);
                                        load();
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <form onSubmit={onSubmit} className="rounded-3xl glass p-5 sm:p-6">
                <h2 className="font-heading text-xl">{editing ? 'Editar recurso' : 'Nuevo recurso'}</h2>
                <input
                    className="field mt-4"
                    placeholder="Título"
                    value={form.titulo_recurso}
                    onChange={(event) => setForm({ ...form, titulo_recurso: event.target.value })}
                    required
                />
                <input
                    className="field"
                    placeholder="Tipo"
                    value={form.tipo_recurso}
                    onChange={(event) => setForm({ ...form, tipo_recurso: event.target.value })}
                />
                <input
                    className="field"
                    placeholder="URL"
                    value={form.url_enlace}
                    onChange={(event) => setForm({ ...form, url_enlace: event.target.value })}
                    required
                />
                <textarea
                    className="field mt-3 min-h-24 h-auto py-2"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                />
                <Button className="mt-5 w-full sm:w-auto" type="submit">
                    Guardar
                </Button>
            </form>
        </div>
    );
}
