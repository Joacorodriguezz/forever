import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../service/api';
import '../styles/HistorialPagos.css';

function HistorialPagos() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(Number(amount || 0));

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getEstadoBadge = (estado) => {
        const map = {
            APROBADO: { bg: 'success', text: 'Aprobado' },
            PENDIENTE: { bg: 'warning', text: 'Pendiente' },
            RECHAZADO: { bg: 'danger', text: 'Rechazado' },
        };
        const cfg = map[estado] || { bg: 'secondary', text: estado };
        return <span className={`badge bg-${cfg.bg}`}>{cfg.text}</span>;
    };

    useEffect(() => {
        fetchHistorial();
    }, []);

    const fetchHistorial = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/api/historial');
            setPagos(Array.isArray(data) ? data : data?.pagos || []);
        } catch (err) {
            console.error('Error al obtener historial:', err);
            setError('No se pudo cargar el historial de pagos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="historial-container">
                <div className="container">
                    <div className="card border-0 rounded-4 px-4 py-4 shadow">
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h3 className="fw-bold mb-0" style={{ color: '#001a47' }}>
                                Historial de Pagos
                            </h3>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/cuotas-table')}
                            >
                                ← Volver a Cuotas
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#001a47' }} role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : pagos.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No tienes pagos registrados aún.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)' }}>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Mes</th>
                                            <th>Disciplina</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                            <th>Comprobante</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagos.map((pago) => (
                                            <tr key={pago.id}>
                                                <td>{formatDate(pago.fechaPago)}</td>
                                                <td>{pago.cuota?.mes || '—'}</td>
                                                <td>{pago.cuota?.disciplina?.nombre || '—'}</td>
                                                <td className="fw-semibold">{formatCurrency(pago.cuota?.monto)}</td>
                                                <td>{getEstadoBadge(pago.estadoPago)}</td>
                                                <td>
                                                    {pago.linkComprobante ? (
                                                        <a
                                                            href={pago.linkComprobante}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            📄 Ver
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HistorialPagos;
