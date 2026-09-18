import CatalogCrudPanel from '@/components/admin/CatalogCrudPanel';

const config = {
    title: 'Categorías',
    subtitle: 'Catálogo de proyectos',
    listKey: 'categorias',
    idField: 'id_categoria',
    nameField: 'nombre_categoria',
    descField: 'descripcion_categoria',
    nameLabel: 'Nombre',
    descLabel: 'Descripción',
    namePlaceholder: 'Opcional',
    apiPath: '/admin/categorias',
};

export default function AdminCategoriasPage() {
    return <CatalogCrudPanel config={config} />;
}
