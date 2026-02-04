import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../service/api';

function ReportePagosPendientes() {
    const [deudores, setDeudores] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDeudores();
    }, []);

    const fetchDeudores = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/reportes/deportistas/pagos-pendientes');
            setDeudores(Array.isArray(data) ? data : data?.deudores || []);
        } catch (err) {
            console.error('Error al cargar deudores:', err);
            alert('Error al cargar el reporte de deudores');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(Number(amount || 0));

    const descargarExcel = () => {
        alert('Descarga de Excel en desarrollo');
    };

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffebee 30%, #f5f5f5 100%)',
                padding: '2rem 1rem'
            }}>
                <div className="container">
                    <div className="card border-0 rounded-4 px-4 py-4 shadow" style={{
                        boxShadow: '0 8px 24px rgba(211, 47, 47, 0.25)',
                        borderTop: '6px solid #d32f2f',
                        marginTop: '2rem'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <div>
                                <h3 className="fw-bold mb-0" style={{ color: '#001a47' }}>
                                    Reporte de Pagos Pendientes
                                </h3>
                                <p className="text-muted small mb-0 mt-1">
                                    Deportistas con cuotas vencidas o pendientes
                                </p>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-success"
                                    onClick={descargarExcel}
                                    disabled={deudores.length === 0}
                                >
                                    📥 Descargar Excel
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/inicio')}
                                >
                                    ← Volver
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#d32f2f' }} />
                            </div>
                        ) : deudores.length === 0 ? (
                            <div className="alert alert-success text-center">
                                ✅ No hay deportistas con pagos pendientes
                            </div>
                        ) : (
                            <>
                                <div className="alert alert-warning mb-4">
                                    <strong>⚠️ {deudores.length}</strong> deportista{deudores.length !== 1 ? 's' : ''} con deudas pendientes
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead style={{ background: 'linear-gradient(135deg, #ffebee 0%, #f5f5f5 100%)' }}>
                                            <tr>
                                                <th>DNI</th>
                                                <th>Nombre Completo</th>
                                                <th>Email</th>
                                                <th>Cuotas Pendientes</th>
                                                <th>Total Adeudado</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deudores.map((dep) => (
                                                <tr key={dep.id}>
                                                    <td className="fw-semibold">{dep.dni}</td>
                                                    <td>{dep.nombre} {dep.apellido}</td>
                                                    <td>{dep.usuario?.email || '—'}</td>
                                                    <td className="text-center">
                                                        <span className="badge bg-warning text-dark">
                                                            {dep.cuotasPendientes || 0}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-danger">
                                                        {formatCurrency(dep.totalAdeudado || 0)}
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${dep.estado === 'EN_MORA' ? 'danger' : 'warning'}`}>
                                                            {dep.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ background: '#fff3e0', fontWeight: 'bold' }}>
                                                <td colSpan="4" className="text-end">TOTAL GENERAL:</td>
                                                <td className="text-danger">
                                                    {formatCurrency(deudores.reduce((sum, d) => sum + (d.totalAdeudado || 0), 0))}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportePagosPendientes;
