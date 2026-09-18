import axios from 'axios';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

type Row = Record<string, string | number | null | undefined>;

type CatalogCrudConfig = {
    title: string;
    subtitle: string;
    listKey: string;
    idField: string;
    nameField: string;
    descField: string;
    nameLabel: string;
    descLabel: string;
    namePlaceholder: string;
    apiPath: string;
};

export default function CatalogCrudPanel({ config }: { config: CatalogCrudConfig }) {
    const [items, setItems] = useState<Row[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    function load() {
        api.get(config.apiPath).then((response) => {
            setItems(response.data[config.listKey] ?? []);
        });
    }

    useEffect(() => {
        load();
    }, [config.apiPath, config.listKey]);

    function resetForm() {
        setName('');
        setDescription('');
        setEditingId(null);
        setCreating(false);
        setError('');
    }

    function startCreate() {
        resetForm();
        setCreating(true);
    }

    function startEdit(row: Row) {
        setCreating(false);
        setEditingId(Number(row[config.idField]));
        setName(String(row[config.nameField] ?? ''));
        setDescription(String(row[config.descField] ?? ''));
        setError('');
    }

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        const payload = {
            [config.nameField]: name.trim(),
            [config.descField]: description.trim() || null,
        };

        try {
            if (editingId) {
                await api.put(`${config.apiPath}/${editingId}`, payload);
            } else {
                await api.post(config.apiPath, payload);
            }
            resetForm();
            load();
        } catch (caught) {
            if (axios.isAxiosError(caught)) {
                const message = (caught.response?.data as { message?: string })?.message;
                setError(message ?? 'No se pudo guardar.');
                return;
            }
            setError('No se pudo guardar.');
        }
    }

    async function remove(row: Row) {
        const label = String(row[config.nameField] ?? 'este registro');
        if (!confirm(`¿Eliminar "${label}"?`)) return;
        setError('');
        try {
            await api.delete(`${config.apiPath}/${row[config.idField]}`);
            if (editingId === row[config.idField]) resetForm();
            load();
        } catch (caught) {
            if (axios.isAxiosError(caught)) {
                const message = (caught.response?.data as { message?: string })?.message;
                setError(message ?? 'No se pudo eliminar.');
                return;
            }
            setError('No se pudo eliminar.');
        }
    }

    const showForm = creating || editingId !== null;

    return (
        <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{config.subtitle}</p>
                    <h1 className="font-heading mt-2 text-3xl">{config.title}</h1>
                </div>
                {!showForm && (
                    <Button type="button" onClick={startCreate} className="gap-2">
                        <Plus className="h-4 w-4" aria-hidden />
                        Nuevo
                    </Button>
                )}
            </div>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

            {showForm ? (
                <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl glass p-5 sm:p-6">
                    <h2 className="font-heading text-xl">{editingId ? 'Editar registro' : 'Nuevo registro'}</h2>
                    <label className="block text-sm text-slate-600">
                        {config.nameLabel}
                        <input className="field" value={name} onChange={(event) => setName(event.target.value)} maxLength={50} required />
                    </label>
                    <label className="block text-sm text-slate-600">
                        {config.descLabel}
                        <input className="field" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={255} placeholder={config.namePlaceholder} />
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <Button type="submit" className="gap-2">
                            <Check className="h-4 w-4" aria-hidden />
                            Guardar
                        </Button>
                        <Button type="button" variant="outline" className="gap-2" onClick={resetForm}>
                            <X className="h-4 w-4" aria-hidden />
                            Cancelar
                        </Button>
                    </div>
                </form>
            ) : null}

            <ul className="mt-8 divide-y divide-slate-200/80 overflow-hidden rounded-2xl glass">
                {items.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-slate-500">Sin registros todavía.</li>
                ) : (
                    items.map((row) => (
                        <li key={String(row[config.idField])} className="flex items-start gap-3 px-4 py-4 sm:items-center">
                            <div className="min-w-0 flex-1">
                                <p className="font-heading text-lg text-slate-900">{String(row[config.nameField])}</p>
                                {row[config.descField] ? (
                                    <p className="mt-1 text-sm text-slate-500">{String(row[config.descField])}</p>
                                ) : null}
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button
                                    type="button"
                                    aria-label={`Editar ${String(row[config.nameField])}`}
                                    onClick={() => startEdit(row)}
                                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white/60 hover:text-slate-900"
                                >
                                    <Pencil className="h-4 w-4" aria-hidden />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Eliminar ${String(row[config.nameField])}`}
                                    onClick={() => void remove(row)}
                                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden />
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
