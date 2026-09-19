import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PublicLayout from '@/components/PublicLayout';
import { appRoot } from '@/lib/api';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import ProyectoDetallePage from '@/pages/ProyectoDetallePage';
import PortafolioPage from '@/pages/PortafolioPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminCategoriasPage from '@/pages/admin/AdminCategoriasPage';
import AdminEstilosPage from '@/pages/admin/AdminEstilosPage';
import AdminPerfilPage from '@/pages/admin/AdminPerfilPage';
import AdminPiePage from '@/pages/admin/AdminPiePage';
import AdminProyectosPage from '@/pages/admin/AdminProyectosPage';
import AdminRecursosPage from '@/pages/admin/AdminRecursosPage';
import AdminServiciosPage from '@/pages/admin/AdminServiciosPage';
import ProyectoFormPage from '@/pages/admin/ProyectoFormPage';
import '../css/app.css';

createRoot(document.getElementById('app')!).render(
    <ThemeProvider>
        <AuthProvider>
            <BrowserRouter basename={appRoot === '' ? undefined : appRoot}>
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/portafolio" element={<PortafolioPage />} />
                        <Route path="/proyecto/:id" element={<ProyectoDetallePage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminProyectosPage />} />
                        <Route path="nuevo" element={<ProyectoFormPage />} />
                        <Route path=":id/editar" element={<ProyectoFormPage />} />
                        <Route path="servicios" element={<AdminServiciosPage />} />
                        <Route path="recursos" element={<AdminRecursosPage />} />
                        <Route path="categorias" element={<AdminCategoriasPage />} />
                        <Route path="estilos" element={<AdminEstilosPage />} />
                        <Route path="perfil" element={<AdminPerfilPage />} />
                        <Route path="pie" element={<AdminPiePage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>,
);
