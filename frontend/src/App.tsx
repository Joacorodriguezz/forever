import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ProfileEdit } from './pages/ProfileEdit';
import { DebtStatus } from './pages/DebtStatus';

// Placeholder pages
const Cuotas = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Cuotas</h1><p>Página en construcción</p></div>;
const HistorialPagos = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Historial de Pagos</h1><p>Página en construcción</p></div>;
const GrupoFamiliar = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h1>Grupo Familiar</h1><p>Página en construcción</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<ProfileEdit />} />
        <Route path="/estado-deuda" element={<DebtStatus />} />
        <Route path="/cuotas" element={<Cuotas />} />
        <Route path="/historial-pagos" element={<HistorialPagos />} />
        <Route path="/grupo-familiar" element={<GrupoFamiliar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
