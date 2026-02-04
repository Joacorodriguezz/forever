import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function PagoPending() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #fff3e0 50%, #f5f5f5 100%)',
                padding: '3rem 1rem'
            }}>
                <div className="container">
                    <div className="card border-0 rounded-4 px-4 py-5 text-center" style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        boxShadow: '0 8px 24px rgba(245, 124, 0, 0.25)',
                        borderTop: '6px solid #f57c00'
                    }}>
                        <div className="mb-4">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto',
                                background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)'
                            }}>
                                ⏳
                            </div>
                        </div>

                        <h2 className="fw-bold mb-3" style={{ color: '#001a47' }}>
                            Pago Pendiente
                        </h2>

                        <p className="text-muted mb-4">
                            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
                        </p>

                        <div className="alert alert-warning" role="alert">
                            <strong>Importante:</strong> El proceso puede demorar unos minutos. El estado de tu cuota se actualizará automáticamente.
                        </div>

                        <button
                            className="btn btn-lg mt-3"
                            style={{
                                background: 'linear-gradient(135deg, #001a47 0%, #002d6b 100%)',
                                border: 'none',
                                color: 'white',
                                fontWeight: '600',
                                padding: '0.75rem 2rem'
                            }}
                            onClick={() => navigate('/cuotas-table')}
                        >
                            Ver mis cuotas
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PagoPending;
