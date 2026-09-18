import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import SquareCropper from '@/pages/admin/SquareCropper';
import type { Imagen, Proyecto } from '@/types';

type Catalogos = {
    categorias: { id_categoria: number; nombre_categoria: string }[];
    estilos: { id_estilo: number; nombre_estilo: string }[];
};

export default function ProyectoFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [catalogos, setCatalogos] = useState<Catalogos>({ categorias: [], estilos: [] });
    const [galeria, setGaleria] = useState<Imagen[]>([]);
    const [eliminar, setEliminar] = useState<number[]>([]);
    const [miniatura, setMiniatura] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        titulo: '',
        id_categoria: '',
        id_estilo: '',
        ubicacion: '',
        superficie_m2: '',
        descripcion: '',
        plantas: '',
        habitaciones: '',
        banos: '',
        estacionamientos: '',
        terreno_frente_m: '',
        terreno_fondo_m: '',
        alcance_entregables: '',
        estado_visible: true,
    });

    useEffect(() => {
        api.get('/public/catalogos').then((response) => setCatalogos(response.data));
        if (id) {
            api.get(`/admin/proyectos/${id}`).then((response) => {
                const proyecto: Proyecto = response.data.proyecto;
                setForm({
                    titulo: proyecto.titulo,
                    id_categoria: proyecto.categoria?.id_categoria?.toString() ?? '',
                    id_estilo: proyecto.estilo?.id_estilo?.toString() ?? '',
                    ubicacion: proyecto.ubicacion ?? '',
                    superficie_m2: proyecto.superficie_m2?.toString() ?? '',
                    descripcion: proyecto.descripcion ?? '',
                    plantas: proyecto.plantas?.toString() ?? '',
                    habitaciones: proyecto.habitaciones?.toString() ?? '',
                    banos: proyecto.banos?.toString() ?? '',
                    estacionamientos: proyecto.estacionamientos?.toString() ?? '',
                    terreno_frente_m: proyecto.terreno_frente_m?.toString() ?? '',
                    terreno_fondo_m: proyecto.terreno_fondo_m?.toString() ?? '',
                    alcance_entregables: proyecto.alcance_entregables ?? '',
                    estado_visible: proyecto.estado_visible,
                });
                setGaleria(proyecto.imagenes);
            });
        }
    }, [id]);

    const usadas = galeria.filter((item) => !eliminar.includes(item.id_imagen)).length + files.length;

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            payload.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
        });
        if (miniatura) payload.append('miniatura', miniatura);
        files.forEach((file) => payload.append('galeria[]', file));
        eliminar.forEach((item) => payload.append('eliminar_imagenes[]', String(item)));

        try {
            if (id) {
                await api.post(`/admin/proyectos/${id}`, payload);
            } else {
                await api.post('/admin/proyectos', payload);
            }
            navigate('/admin');
        } catch {
            setError('Revisa los campos e inténtalo de nuevo.');
        }
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-10">
            <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Sección 1</p>
                <h1 className="font-heading mt-2 text-3xl">{id ? 'Editar publicación' : 'Nueva publicación'}</h1>
            </div>

            <section className="grid gap-4 rounded-3xl glass p-4 sm:p-6">
                <Field label="Título" value={form.titulo} onChange={(value) => setForm({ ...form, titulo: value })} max={100} required />
                <label className="text-sm text-slate-600">
                    Categoría
                    <select
                        className="field"
                        value={form.id_categoria}
                        onChange={(event) => setForm({ ...form, id_categoria: event.target.value })}
                    >
                        <option value="">Sin categoría</option>
                        {catalogos.categorias.map((item) => (
                            <option key={item.id_categoria} value={item.id_categoria}>
                                {item.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="text-sm text-slate-600">
                    Estilo
                    <select
                        className="field"
                        value={form.id_estilo}
                        onChange={(event) => setForm({ ...form, id_estilo: event.target.value })}
                    >
                        <option value="">Sin estilo</option>
                        {catalogos.estilos.map((item) => (
                            <option key={item.id_estilo} value={item.id_estilo}>
                                {item.nombre_estilo}
                            </option>
                        ))}
                    </select>
                </label>
                <Field label="Ubicación" value={form.ubicacion} onChange={(value) => setForm({ ...form, ubicacion: value })} max={150} />
                <Field label="Superficie m²" value={form.superficie_m2} onChange={(value) => setForm({ ...form, superficie_m2: value })} />
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Frente (m)" value={form.terreno_frente_m} onChange={(value) => setForm({ ...form, terreno_frente_m: value })} />
                    <Field label="Fondo (m)" value={form.terreno_fondo_m} onChange={(value) => setForm({ ...form, terreno_fondo_m: value })} />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    <Field label="Plantas" value={form.plantas} onChange={(value) => setForm({ ...form, plantas: value })} />
                    <Field label="Habitaciones" value={form.habitaciones} onChange={(value) => setForm({ ...form, habitaciones: value })} />
                    <Field label="Baños" value={form.banos} onChange={(value) => setForm({ ...form, banos: value })} />
                    <Field label="Estacionamientos" value={form.estacionamientos} onChange={(value) => setForm({ ...form, estacionamientos: value })} />
                </div>
                <label className="text-sm text-slate-600">
                    Descripción ({form.descripcion.length}/2200)
                    <textarea
                        className="field mt-2 min-h-32 h-auto py-2"
                        maxLength={2200}
                        value={form.descripcion}
                        onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                    />
                </label>
                <label className="text-sm text-slate-600">
                    Alcance / entregables
                    <textarea
                        className="field mt-2 min-h-24 h-auto py-2"
                        maxLength={1000}
                        value={form.alcance_entregables}
                        onChange={(event) => setForm({ ...form, alcance_entregables: event.target.value })}
                    />
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={form.estado_visible}
                        onChange={(event) => setForm({ ...form, estado_visible: event.target.checked })}
                    />
                    Guardar y publicar
                </label>
            </section>

            <section className="space-y-4 rounded-3xl glass p-4 sm:p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Sección 2 · Multimedia</p>
                <SquareCropper onCropped={setMiniatura} />
                {miniatura && <p className="text-xs text-slate-500">Miniatura recortada lista para subir.</p>}

                <div
                    className="rounded-2xl border border-dashed border-slate-300 p-6 text-center"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        const next = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
                        setFiles((current) => [...current, ...next].slice(0, Math.max(0, 4 - galeria.filter((item) => !eliminar.includes(item.id_imagen)).length)));
                    }}
                >
                    <p className="text-sm text-slate-600">Arrastra fotos del carrusel o selecciónalas</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{usadas}/4 fotos utilizadas</p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-4 cursor-pointer text-sm"
                        onChange={(event) => {
                            const next = Array.from(event.target.files ?? []);
                            setFiles((current) => [...current, ...next].slice(0, Math.max(0, 4 - galeria.filter((item) => !eliminar.includes(item.id_imagen)).length)));
                        }}
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {galeria.map((item) => (
                        <button
                            type="button"
                            key={item.id_imagen}
                            className={`cursor-pointer overflow-hidden rounded-xl border ${eliminar.includes(item.id_imagen) ? 'opacity-30' : 'border-slate-200'}`}
                            onClick={() =>
                                setEliminar((current) =>
                                    current.includes(item.id_imagen) ? current.filter((idItem) => idItem !== item.id_imagen) : [...current, item.id_imagen],
                                )
                            }
                        >
                            <img src={item.imagen_url} alt="" className="aspect-square w-full object-cover" />
                        </button>
                    ))}
                </div>
            </section>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <section className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                    Cancelar
                </Button>
                <Button type="submit">Guardar y publicar</Button>
            </section>
        </form>
    );
}

function Field({
    label,
    value,
    onChange,
    max,
    required,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    max?: number;
    required?: boolean;
}) {
    return (
        <label className="text-sm text-slate-600">
            {label}
            <input
                className="field"
                value={value}
                maxLength={max}
                required={required}
                onChange={(event) => onChange(event.target.value)}
            />
        </label>
    );
}
