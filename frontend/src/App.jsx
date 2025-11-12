import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Públicas
import IniciarSesion from './pages/IniciarSesion';
import Registrarse from './pages/Registrarse';
import HomePage from './pages/HomePage';
import Contacto from './pages/Contacto';

// SOCIO
import HomePageUser from './pages/HomePageUser';
import CuotasTable from './pages/CuotasTable';
import ReservaCancha from './pages/ReservaCanchaSocio';
import SocioEntradas from './pages/SocioEntradas';
import ActividadesSocio from './pages/ActividadesSocio';
import MiPerfil from './pages/MiPerfil';
import ModificarDatos from './pages/ModificarDatos';
import MisReservas from './pages/MisReservas';

// ADMINISTRATIVO + ADMIN
import CuotasAdminPage from './pages/CuotasAdminPage';
import ActividadesAdmin from './pages/ActividadesAdmin';
import ClasesAdmin from './pages/ClasesAdmin';
import AdminEventos from './pages/AdminEventos';
import ReservaCanchasAdmin from './pages/ReservaCanchaAdmin';
import Canchas from './pages/Canchas';
import SociosList from './pages/ListSocios';
import MisReservasAdmin from './pages/MisReservasAdmin';

// SOLO ADMIN
import GenerarCuota from './pages/generarCuota';
import CrearAdministrativos from './pages/CrearAdministrativos';
import AdministrativosList from './pages/ListAdministrativos';
import ListProfesores from './pages/ListProfesor';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>

            {/* Públicas */}
            <Route path="/" element={<IniciarSesion />} />
            <Route path="/registro" element={<Registrarse />} />
            <Route path="/inicio" element={<HomePage />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* SOCIO */}
            <Route
              path="/inicioSocio"
              element={<PrivateRoute allowedRoles={['SOCIO']}><HomePageUser /></PrivateRoute>}
            />
            <Route
              path="/cuotas-table"
              element={<PrivateRoute allowedRoles={['SOCIO']}><CuotasTable /></PrivateRoute>}
            />
            <Route
              path="/canchasSocio"
              element={<PrivateRoute allowedRoles={['SOCIO']}><ReservaCancha /></PrivateRoute>}
            />
            <Route
              path="/modDatos"
              element={<PrivateRoute allowedRoles={['SOCIO', 'ADMINISTRATIVO']}><ModificarDatos /></PrivateRoute>}
            />
            <Route
              path="/entradasSocio"
              element={<PrivateRoute allowedRoles={['SOCIO']}><SocioEntradas /></PrivateRoute>}
            />
            <Route
              path="/perfil"
              element={<PrivateRoute allowedRoles={['SOCIO', 'ADMINISTRATIVO']}><MiPerfil /></PrivateRoute>}
            />
            <Route
              path="/actividadesSocio"
              element={<PrivateRoute allowedRoles={['SOCIO']}><ActividadesSocio /></PrivateRoute>}
            />
            <Route
              path="/misReservas"
              element={<PrivateRoute allowedRoles={['SOCIO']}><MisReservas /></PrivateRoute>}
            />

            {/* ADMINISTRATIVO + ADMIN */}
            <Route
              path="/eventos"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><AdminEventos /></PrivateRoute>}
            />
            <Route
              path="/canchas"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><ReservaCanchasAdmin /></PrivateRoute>}
            />
            <Route
              path="/actividades"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><ActividadesAdmin /></PrivateRoute>}
            />
            <Route
              path="/clases/:actividadId"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><ClasesAdmin /></PrivateRoute>}
            />
            <Route
              path="/socios"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><SociosList /></PrivateRoute>}
            />
            <Route
              path="/gestionCanchas"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><Canchas /></PrivateRoute>}
            />
            <Route
              path="/cuotas-admin"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><CuotasAdminPage /></PrivateRoute>}
            />
            <Route
              path="/misReservasAdmin"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><MisReservasAdmin /></PrivateRoute>}
            />

            {/* SOLO ADMIN */}
            <Route
              path="/administrativos"
              element={<PrivateRoute allowedRoles={['ADMIN']}><AdministrativosList /></PrivateRoute>}
            />
            <Route
              path="/crear-administrativo"
              element={<PrivateRoute allowedRoles={['ADMIN']}><CrearAdministrativos /></PrivateRoute>}
            />
            <Route
              path="/profesores"
              element={<PrivateRoute allowedRoles={['ADMIN']}><ListProfesores /></PrivateRoute>}
            />
            <Route
              path="/generar-cuota"
              element={<PrivateRoute allowedRoles={['ADMIN']}><GenerarCuota /></PrivateRoute>}
            />

          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
