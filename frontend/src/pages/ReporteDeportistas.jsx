import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../service/api';

function ReporteDeportistas() {
    const [deportistas, setDeportistas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        disciplina: '',
        estado: '',
    });
    const navigate = useNavigate();

    const fetchDeportistas = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtros.disciplina) params.append('disciplina', filtros.disciplina);
            if (filtros.estado) params.append('estado', filtros.estado);

            const { data } = await api.get(`/api/reportes/deportistas?${params}`);
            setDeportistas(Array.isArray(data) ? data : data?.deportistas || []);
        } catch (err) {
            console.error('Error al generar reporte:', err);
            alert('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    const descargarExcel = () => {
        // Implementar descarga de Excel
        alert('Descarga de Excel en desarrollo');
    };

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #f5f5f5 100%)',
                padding: '2rem 1rem'
            }}>
                <div className="container">
                    <div className="card border-0 rounded-4 px-4 py-4 shadow" style={{
                        boxShadow: '0 8px 24px rgba(0, 26, 71, 0.25)',
                        borderTop: '6px solid #001a47',
                        marginTop: '2rem'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h3 className="fw-bold mb-0" style={{ color: '#001a47' }}>
                                Reporte de Deportistas
                            </h3>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/inicio')}
                            >
                                ← Volver
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <label className="form-label">Disciplina</label>
                                <select
                                    className="form-select"
                                    value={filtros.disciplina}
                                    onChange={(e) => setFiltros({ ...filtros, disciplina: e.target.value })}
                                >
                                    <option value="">Todas</option>
                                    <option value="Fútbol">Fútbol</option>
                                    <option value="Básquet">Básquet</option>
                                    <option value="Vóley">Vóley</option>
                                    <option value="Natación">Natación</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Estado</label>
                                <select
                                    className="form-select"
                                    value={filtros.estado}
                                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                >
                                    <option value="">Todos</option>
                                    <option value="AL_DIA">Al día</option>
                                    <option value="EN_MORA">En mora</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                            <div className="col-md-4 d-flex align-items-end gap-2">
                                <button
                                    className="btn w-100"
                                    style={{
                                        background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                                        border: 'none',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}
                                    onClick={fetchDeportistas}
                                    disabled={loading}
                                >
                                    {loading ? 'Generando...' : '🔍 Generar Reporte'}
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={descargarExcel}
                                    disabled={deportistas.length === 0}
                                >
                                    📥 Excel
                                </button>
                            </div>
                        </div>

                        {/* Tabla */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#001a47' }} />
                            </div>
                        ) : deportistas.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No hay deportistas con los filtros seleccionados
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)' }}>
                                        <tr>
                                            <th>DNI</th>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Disciplina</th>
                                            <th>Estado</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deportistas.map((dep) => (
                                            <tr key={dep.id}>
                                                <td>{dep.dni}</td>
                                                <td>{dep.nombre}</td>
                                                <td>{dep.apellido}</td>
                                                <td>{dep.disciplina?.nombre || '—'}</td>
                                                <td>
                                                    <span className={`badge bg-${dep.estado === 'AL_DIA' ? 'success' : 'warning'}`}>
                                                        {dep.estado}
                                                    </span>
                                                </td>
                                                <td>{dep.usuario?.email || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="text-muted small mt-3">
                                    Total: {deportistas.length} deportista{deportistas.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReporteDeportistas;
