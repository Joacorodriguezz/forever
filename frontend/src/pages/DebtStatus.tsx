import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { Footer } from '../components/Footer';
import styles from './DebtStatus.module.css';

interface Quota {
    id: number;
    nroCuota: number;
    anio: number;
    monto: number;
    fechaVencimiento: string;
    estadoCuota: 'PENDIENTE' | 'VENCIDA' | 'PAGADA';
    disciplina: string;
}

interface DebtStatusData {
    cuotasPendientes: Quota[];
    totalAdeudado: number;
}

export const DebtStatus = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [debtData, setDebtData] = useState<DebtStatusData | null>(null);

    useEffect(() => {
        // TODO: Fetch debt status from backend
        // For now, using mock data
        const mockData: DebtStatusData = {
            cuotasPendientes: [
                {
                    id: 1,
                    nroCuota: 1,
                    anio: 2026,
                    monto: 10000,
                    fechaVencimiento: '2026-01-15',
                    estadoCuota: 'VENCIDA',
                    disciplina: 'Fútbol',
                },
                {
                    id: 2,
                    nroCuota: 2,
                    anio: 2026,
                    monto: 10000,
                    fechaVencimiento: '2026-02-15',
                    estadoCuota: 'PENDIENTE',
                    disciplina: 'Fútbol',
                },
            ],
            totalAdeudado: 20000,
        };

        // Simular carga
        setTimeout(() => {
            setDebtData(mockData);
            setLoading(false);
        }, 500);
    }, []);

    const handlePayQuota = (quotaId: number) => {
        // TODO: Implement payment flow
        console.log('Pagar cuota:', quotaId);
        alert('Funcionalidad de pago en desarrollo');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getMonthName = (monthNumber: number) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthNumber - 1];
    };

    if (loading) {
        return (
            <div className={styles.debtStatusPage}>
                <div className={styles.container}>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    const hasDebt = debtData && debtData.cuotasPendientes.length > 0;

    return (
        <div className={styles.debtStatusPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        Volver al Dashboard
                    </button>
                    <h1 className={styles.title}>Estado de Deuda</h1>
                    <p className={styles.subtitle}>Consultá el estado de tus cuotas</p>
                </div>

                {/* Status Banner */}
                <div className={`${styles.statusBanner} ${hasDebt ? styles.statusBannerDebt : styles.statusBannerPaid}`}>
                    <div className={`${styles.statusIcon} ${hasDebt ? styles.statusIconDebt : styles.statusIconPaid}`}>
                        {hasDebt ? <AlertCircle size={64} /> : <CheckCircle size={64} />}
                    </div>
                    <div className={`${styles.statusText} ${hasDebt ? styles.statusTextDebt : styles.statusTextPaid}`}>
                        {hasDebt ? 'DEUDA' : 'AL DÍA'}
                    </div>
                    <p className={styles.statusMessage}>
                        {hasDebt
                            ? `Tenés ${debtData.cuotasPendientes.length} cuota${debtData.cuotasPendientes.length > 1 ? 's' : ''} pendiente${debtData.cuotasPendientes.length > 1 ? 's' : ''} de pago`
                            : '¡Felicitaciones! No tenés cuotas pendientes'}
                    </p>
                </div>

                {/* Pending Quotas List */}
                {hasDebt && (
                    <div className={styles.quotasSection}>
                        <h2 className={styles.sectionTitle}>Cuotas Pendientes</h2>
                        <div className={styles.quotasList}>
                            {debtData.cuotasPendientes.map((quota) => (
                                <div key={quota.id} className={styles.quotaCard}>
                                    <div className={styles.quotaInfo}>
                                        <div className={styles.quotaHeader}>
                                            <span className={styles.quotaNumber}>
                                                {getMonthName(quota.nroCuota)} {quota.anio}
                                            </span>
                                            <span className={`${styles.quotaStatus} ${quota.estadoCuota === 'VENCIDA' ? styles.quotaStatusOverdue : styles.quotaStatusPending}`}>
                                                {quota.estadoCuota === 'VENCIDA' ? 'Vencida' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <div className={styles.quotaDetails}>
                                            <div className={styles.quotaDetail}>
                                                <Calendar size={16} />
                                                Vence: {formatDate(quota.fechaVencimiento)}
                                            </div>
                                            <div className={styles.quotaDetail}>
                                                <DollarSign size={16} />
                                                Disciplina: {quota.disciplina}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className={styles.quotaAmount}>{formatCurrency(quota.monto)}</span>
                                        <button
                                            className={styles.payButton}
                                            onClick={() => handlePayQuota(quota.id)}
                                        >
                                            <CreditCard size={20} />
                                            Pagar Cuota
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Debt */}
                        <div className={styles.totalDebt}>
                            <span className={styles.totalLabel}>Total Adeudado:</span>
                            <span className={styles.totalAmount}>{formatCurrency(debtData.totalAdeudado)}</span>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};
