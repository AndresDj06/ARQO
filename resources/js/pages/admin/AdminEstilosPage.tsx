import CatalogCrudPanel from '@/components/admin/CatalogCrudPanel';

const config = {
    title: 'Estilos',
    subtitle: 'Catálogo de proyectos',
    listKey: 'estilos',
    idField: 'id_estilo',
    nameField: 'nombre_estilo',
    descField: 'descripcion_estilo',
    nameLabel: 'Nombre',
    descLabel: 'Descripción',
    namePlaceholder: 'Opcional',
    apiPath: '/admin/estilos',
};

export default function AdminEstilosPage() {
    return <CatalogCrudPanel config={config} />;
}
