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
import PagoSuccess from './pages/PagoSuccess';
import PagoFailure from './pages/PagoFailure';
import PagoPending from './pages/PagoPending';
import HistorialPagos from './pages/HistorialPagos';
import ReporteDeportistas from './pages/ReporteDeportistas';
import ReportePagosPendientes from './pages/ReportePagosPendientes';

// SOCIO
import HomePageUser from './pages/HomePageUser';
import CuotasTable from './pages/CuotasTable';
import ReservaCancha from './pages/ReservaCanchaDeportista';
import DeportistaEntradas from './pages/DeportistaEntradas';
import ActividadesDeportista from './pages/ActividadesDeportista';
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
import DeportistasList from './pages/ListDeportistas';
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

            {/* Mercado Pago - Resultados de pago */}
            <Route path="/pago/success" element={<PagoSuccess />} />
            <Route path="/pago/failure" element={<PagoFailure />} />
            <Route path="/pago/pending" element={<PagoPending />} />

            {/* SOCIO */}
            <Route
              path="/historial-pagos"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><HistorialPagos /></PrivateRoute>}
            />
            <Route
              path="/inicioDeportista"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><HomePageUser /></PrivateRoute>}
            />
            <Route
              path="/cuotas-table"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><CuotasTable /></PrivateRoute>}
            />
            <Route
              path="/canchasDeportista"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><ReservaCancha /></PrivateRoute>}
            />
            <Route
              path="/modDatos"
              element={<PrivateRoute allowedRoles={['SOCIO', 'ADMINISTRATIVO']}><ModificarDatos /></PrivateRoute>}
            />
            <Route
              path="/entradasDeportista"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><DeportistaEntradas /></PrivateRoute>}
            />
            <Route
              path="/perfil"
              element={<PrivateRoute allowedRoles={['SOCIO', 'ADMINISTRATIVO']}><MiPerfil /></PrivateRoute>}
            />
            <Route
              path="/actividadesDeportista"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><ActividadesDeportista /></PrivateRoute>}
            />
            <Route
              path="/misReservas"
              element={<PrivateRoute allowedRoles={['DEPORTISTA']}><MisReservas /></PrivateRoute>}
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
              path="/deportistas"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><DeportistasList /></PrivateRoute>}
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
            <Route
              path="/reportes/deportistas"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><ReporteDeportistas /></PrivateRoute>}
            />
            <Route
              path="/reportes/pagos-pendientes"
              element={<PrivateRoute allowedRoles={['ADMINISTRATIVO', 'ADMIN']}><ReportePagosPendientes /></PrivateRoute>}
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
