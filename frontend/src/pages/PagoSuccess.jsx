import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function PagoSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #f5f5f5 100%)',
                padding: '3rem 1rem'
            }}>
                <div className="container">
                    <div className="card border-0 rounded-4 px-4 py-5 text-center" style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        boxShadow: '0 8px 24px rgba(0, 26, 71, 0.25)',
                        borderTop: '6px solid #2e7d32'
                    }}>
                        <div className="mb-4">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto',
                                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                            }}>
                                ✓
                            </div>
                        </div>

                        <h2 className="fw-bold mb-3" style={{ color: '#001a47' }}>
                            ¡Pago Exitoso!
                        </h2>

                        <p className="text-muted mb-4">
                            Tu pago se procesó correctamente. En unos momentos se actualizará el estado de tu cuota.
                        </p>

                        {paymentId && (
                            <div className="alert alert-light" role="alert">
                                <strong>ID de Pago:</strong> {paymentId}
                            </div>
                        )}

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

export default PagoSuccess;
