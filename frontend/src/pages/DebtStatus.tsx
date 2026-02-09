import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, AlertCircle, CheckCircle, CreditCard, Info } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { MOCK_GRUPOS_FAMILIARES } from '../data/admin';
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
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [debtData, setDebtData] = useState<DebtStatusData | null>(null);
    const [esTitular, setEsTitular] = useState(true);

    useEffect(() => {
        // Determinar si el usuario es titular del grupo familiar (solo el titular puede pagar)
        const dni = user?.role === 'deportista' ? user.loginId : null;
        if (dni) {
            const grupo = MOCK_GRUPOS_FAMILIARES.find((g) =>
                g.miembros.some((m) => m.dni === dni)
            );
            setEsTitular(!grupo || grupo.titularDni === dni);
        }
    }, [user?.loginId, user?.role]);

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
                <main className={styles.mainContent}>
                    <p className={styles.loadingText}>Cargando...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const hasDebt = debtData && debtData.cuotasPendientes.length > 0;

    return (
        <div className={styles.debtStatusPage}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <img src="/logo.png" alt="Club For Ever" className={styles.headerLogo} />
                    <span className={styles.headerClubName}>Club Social y Deportivo For Ever</span>
                </div>
                <h1 className={styles.title}>Estado de Deuda</h1>
                <div className={styles.headerRight} aria-hidden />
            </header>

            <main className={styles.mainContent}>
                <div className={styles.contentCard}>
                    {/* Status Banner */}
                    <div className={`${styles.statusBanner} ${hasDebt ? styles.statusBannerDebt : styles.statusBannerPaid}`}>
                        <div className={`${styles.statusIcon} ${hasDebt ? styles.statusIconDebt : styles.statusIconPaid}`}>
                            {hasDebt ? <AlertCircle size={56} /> : <CheckCircle size={56} />}
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
                                        <div className={styles.quotaActions}>
                                            <span className={styles.quotaAmount}>{formatCurrency(quota.monto)}</span>
                                            {esTitular ? (
                                                <button
                                                    type="button"
                                                    className={styles.payButton}
                                                    onClick={() => handlePayQuota(quota.id)}
                                                >
                                                    <CreditCard size={20} />
                                                    Pagar Cuota
                                                </button>
                                            ) : (
                                                <span className={styles.payDisabled}>Solo el titular puede pagar</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.totalDebt}>
                                <span className={styles.totalLabel}>Total Adeudado:</span>
                                <span className={styles.totalAmount}>{formatCurrency(debtData.totalAdeudado)}</span>
                            </div>

                            {!esTitular && (
                                <div className={styles.titularNotice}>
                                    <Info size={22} />
                                    <p>
                                        Solo el titular del grupo familiar puede realizar el pago de cuotas. Contactate con el titular o con el club para regularizar.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                            Volver
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
