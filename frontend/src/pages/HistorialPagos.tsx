import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Footer } from '../components/Footer';
import styles from './HistorialPagos.module.css';

export type EstadoOperacion = 'APROBADA' | 'RECHAZADA';

const MESES_CUOTA: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface Operacion {
    id: number;
    fecha: string;       // fecha en que se realizó el pago
    mesCuota: number;    // 1-12 (mes de la cuota: Enero a Diciembre)
    anioCuota: number;
    monto: number;
    estado: EstadoOperacion;
    concepto?: string;
}

// Una cuota por mes (Enero–Diciembre): un solo registro por mes/año.
const MOCK_OPERACIONES: Operacion[] = [
    { id: 1, fecha: '2026-02-05', mesCuota: 2, anioCuota: 2026, monto: 10000, estado: 'APROBADA', concepto: 'Cuota Febrero 2026' },
    { id: 2, fecha: '2026-01-12', mesCuota: 1, anioCuota: 2026, monto: 10000, estado: 'APROBADA', concepto: 'Cuota Enero 2026' },
    { id: 3, fecha: '2025-12-08', mesCuota: 12, anioCuota: 2025, monto: 9500, estado: 'APROBADA', concepto: 'Cuota Diciembre 2025' },
    { id: 4, fecha: '2025-11-15', mesCuota: 11, anioCuota: 2025, monto: 9500, estado: 'APROBADA', concepto: 'Cuota Noviembre 2025' },
    { id: 5, fecha: '2025-10-03', mesCuota: 10, anioCuota: 2025, monto: 9500, estado: 'APROBADA', concepto: 'Cuota Octubre 2025' },
    { id: 6, fecha: '2025-09-20', mesCuota: 9, anioCuota: 2025, monto: 9000, estado: 'APROBADA', concepto: 'Cuota Septiembre 2025' },
];

const ESTADOS_OPTIONS: { value: '' | EstadoOperacion; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'APROBADA', label: 'Aprobada' },
    { value: 'RECHAZADA', label: 'Rechazada' },
];

export const HistorialPagos = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [filtroAnio, setFiltroAnio] = useState<string>('');
    const [filtroEstado, setFiltroEstado] = useState<'' | EstadoOperacion>('');

    useEffect(() => {
        setTimeout(() => {
            setOperaciones(MOCK_OPERACIONES);
            setLoading(false);
        }, 400);
    }, []);

    const anioDeCuota = (op: Operacion) => op.anioCuota ?? new Date(op.fecha).getFullYear();

    const aniosDisponibles = useMemo(() => {
        const anios = new Set(operaciones.map((o) => anioDeCuota(o)));
        return Array.from(anios).sort((a, b) => b - a);
    }, [operaciones]);

    const operacionesFiltradas = useMemo(() => {
        const filtradas = operaciones.filter((op) => {
            const cumpleAnio = !filtroAnio || String(anioDeCuota(op)) === filtroAnio;
            const cumpleEstado = !filtroEstado || op.estado === filtroEstado;
            return cumpleAnio && cumpleEstado;
        });
        // Una sola cuota por mes: si hay más de un pago para el mismo mes/año, quedarse con uno (priorizar APROBADA, sino el más reciente).
        const porMesAnio = new Map<string, Operacion>();
        filtradas.forEach((op) => {
            const key = `${op.mesCuota}-${op.anioCuota}`;
            const existente = porMesAnio.get(key);
            if (!existente) {
                porMesAnio.set(key, op);
            } else if (op.estado === 'APROBADA' && existente.estado !== 'APROBADA') {
                porMesAnio.set(key, op);
            } else if (existente.estado !== 'APROBADA' && op.estado === 'APROBADA') {
                porMesAnio.set(key, op);
            } else if (new Date(op.fecha) > new Date(existente.fecha)) {
                porMesAnio.set(key, op);
            }
        });
        return Array.from(porMesAnio.values()).sort((a, b) => {
            const dA = new Date(a.anioCuota, a.mesCuota - 1);
            const dB = new Date(b.anioCuota, b.mesCuota - 1);
            return dB.getTime() - dA.getTime();
        });
    }, [operaciones, filtroAnio, filtroEstado]);

    const mesCuotaLabel = (op: Operacion): string => {
        const mes = op.mesCuota ?? new Date(op.fecha).getMonth() + 1;
        const anio = op.anioCuota ?? new Date(op.fecha).getFullYear();
        const nombreMes = (mes >= 1 && mes <= 12) ? MESES_CUOTA[mes - 1] : 'N/D';
        return `${nombreMes} ${anio}`;
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

    if (loading) {
        return (
            <div className={styles.page}>
                <main className={styles.mainContent}>
                    <p className={styles.loadingText}>Cargando...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <img src="/logo.png" alt="Club For Ever" className={styles.headerLogo} />
                    <span className={styles.headerClubName}>Club Social y Deportivo For Ever</span>
                </div>
                <h1 className={styles.title}>Historial de Pagos</h1>
                <div className={styles.headerRight} aria-hidden />
            </header>

            <main className={styles.mainContent}>
                <div className={styles.contentCard}>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="filtro-anio" className={styles.filterLabel}>Año</label>
                            <select
                                id="filtro-anio"
                                className={styles.select}
                                value={filtroAnio}
                                onChange={(e) => setFiltroAnio(e.target.value)}
                            >
                                <option value="">Todos los años</option>
                                {aniosDisponibles.map((anio) => (
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="filtro-estado" className={styles.filterLabel}>Estado</label>
                            <select
                                id="filtro-estado"
                                className={styles.select}
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value as '' | EstadoOperacion)}
                            >
                                {ESTADOS_OPTIONS.map((opt) => (
                                    <option key={opt.value || 'todos'} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Operaciones</h2>

                    {operacionesFiltradas.length === 0 ? (
                        <p className={styles.emptyState}>No hay operaciones con los filtros seleccionados.</p>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.th}>Cuota (mes) / Fecha de pago</th>
                                        <th className={styles.th}>Monto</th>
                                        <th className={styles.th}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operacionesFiltradas.map((op) => (
                                        <tr key={op.id} className={styles.tr}>
                                            <td className={styles.td}>
                                                <span className={styles.cuotaConFecha}>
                                                    <span className={styles.cellWithIcon}>
                                                        <Calendar size={18} />
                                                        <strong>Cuota {mesCuotaLabel(op)}</strong>
                                                    </span>
                                                    <span className={styles.fechaPago}>Pagado: {formatDate(op.fecha)}</span>
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.cellWithIcon}>
                                                    <DollarSign size={18} />
                                                    {formatCurrency(op.monto)}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={`${styles.badge} ${op.estado === 'APROBADA' ? styles.badgeAprobada : styles.badgeRechazada}`}>
                                                    {op.estado === 'APROBADA' ? (
                                                        <><CheckCircle size={18} /> Aprobada</>
                                                    ) : (
                                                        <><XCircle size={18} /> Rechazada</>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
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
