import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { Servicio } from '@/types';

const empty = {
    nombre_servicio: '',
    descripcion_corta: '',
    descripcion_detallada: '',
    estado_activo: true,
};

export default function AdminServiciosPage() {
    const [items, setItems] = useState<Servicio[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<number | null>(null);

    function load() {
        api.get('/admin/servicios').then((response) => setItems(response.data.servicios));
    }

    useEffect(() => {
        load();
    }, []);

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        if (editing) {
            await api.put(`/admin/servicios/${editing}`, form);
        } else {
            await api.post('/admin/servicios', form);
        }
        setForm(empty);
        setEditing(null);
        load();
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
                <h1 className="font-heading text-3xl">Servicios</h1>
                <div className="mt-6 space-y-3">
                    {items.map((item) => (
                        <article key={item.id_servicio} className="rounded-2xl glass p-4">
                            <h2 className="font-heading">{item.nombre_servicio}</h2>
                            <p className="text-sm text-slate-500">{item.descripcion_corta}</p>
                            <div className="mt-3 flex gap-3 text-sm">
                                <button
                                    type="button"
                                    className="cursor-pointer underline"
                                    onClick={() => {
                                        setEditing(item.id_servicio);
                                        setForm({
                                            nombre_servicio: item.nombre_servicio,
                                            descripcion_corta: item.descripcion_corta ?? '',
                                            descripcion_detallada: item.descripcion_detallada ?? '',
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
                                        await api.delete(`/admin/servicios/${item.id_servicio}`);
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
                <h2 className="font-heading text-xl">{editing ? 'Editar servicio' : 'Nuevo servicio'}</h2>
                <input
                    className="field mt-4"
                    placeholder="Nombre"
                    value={form.nombre_servicio}
                    onChange={(event) => setForm({ ...form, nombre_servicio: event.target.value })}
                    required
                />
                <input
                    className="field"
                    placeholder="Descripción corta"
                    value={form.descripcion_corta}
                    onChange={(event) => setForm({ ...form, descripcion_corta: event.target.value })}
                />
                <textarea
                    className="field mt-3 min-h-28 h-auto py-2"
                    placeholder="Descripción detallada"
                    value={form.descripcion_detallada}
                    onChange={(event) => setForm({ ...form, descripcion_detallada: event.target.value })}
                />
                <Button className="mt-5 w-full sm:w-auto" type="submit">
                    Guardar
                </Button>
            </form>
        </div>
    );
}
