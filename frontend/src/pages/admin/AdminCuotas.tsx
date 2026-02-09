import { useState, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import type { CuotaAdmin } from '../../types/admin';
import { useOpcionesAdmin } from '../../context/OpcionesAdminContext';
import styles from './AdminCuotas.module.css';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const AdminCuotas = () => {
    const { disciplinasNombres, generosNombres, getCategoriasOptions, getSubcategoriaOptions } = useOpcionesAdmin();
    const [cuotas, setCuotas] = useState<CuotaAdmin[]>([]);
    const [filtroEfectivo, setFiltroEfectivo] = useState<boolean | 'todos'>('todos');
    const [filtroDisciplina, setFiltroDisciplina] = useState('');
    const [filtroGenero, setFiltroGenero] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroSubcategoria, setFiltroSubcategoria] = useState('');

    const marcarComoPagada = (id: number) => {
        setCuotas((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, estadoCuota: 'PAGADA' as const, formaPago: 'efectivo' as const, fechaPago: new Date().toISOString().slice(0, 10) }
                    : c
            )
        );
    };

    const opcionesCategoria = useMemo(() => getCategoriasOptions(filtroDisciplina, filtroGenero), [filtroDisciplina, filtroGenero, getCategoriasOptions]);
    const opcionesSubcategoria = useMemo(() => getSubcategoriaOptions(filtroDisciplina, filtroGenero, filtroCategoria), [filtroDisciplina, filtroGenero, filtroCategoria, getSubcategoriaOptions]);

    const listadoPorFiltros = useMemo(() => {
        let list = cuotas;
        if (filtroDisciplina) list = list.filter((c) => c.disciplina === filtroDisciplina);
        if (filtroGenero) list = list.filter((c) => c.genero === filtroGenero);
        if (filtroCategoria) list = list.filter((c) => c.categoria === filtroCategoria);
        if (filtroSubcategoria) list = list.filter((c) => c.subcategoria === filtroSubcategoria);
        return list;
    }, [cuotas, filtroDisciplina, filtroGenero, filtroCategoria, filtroSubcategoria]);

    const listado = filtroEfectivo === 'todos'
        ? listadoPorFiltros
        : filtroEfectivo
            ? listadoPorFiltros.filter((c) => c.formaPago === 'efectivo')
            : listadoPorFiltros.filter((c) => c.formaPago === 'sistema');

    const pendientesEfectivo = listado.filter((c) => c.formaPago === 'efectivo' && c.estadoCuota === 'PENDIENTE');

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Gestión cuotas</h2>
            <p className={styles.subtitle}>Modificar las cuotas pagadas en efectivo a pagadas.</p>

            <div className={styles.filtersRow}>
                <div className={styles.filters}>
                    <label>
                        <span className={styles.filterLabel}>Disciplina</span>
                        <select value={filtroDisciplina} onChange={(e) => { setFiltroDisciplina(e.target.value); setFiltroCategoria(''); setFiltroSubcategoria(''); }}>
                            <option value="">Todas</option>
                            {disciplinasNombres.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </label>
                    <label>
                        <span className={styles.filterLabel}>Género</span>
                        <select value={filtroGenero} onChange={(e) => { setFiltroGenero(e.target.value); setFiltroCategoria(''); setFiltroSubcategoria(''); }}>
                            <option value="">Todos</option>
                            {generosNombres.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </label>
                    <label>
                        <span className={styles.filterLabel}>Categoría</span>
                        <select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setFiltroSubcategoria(''); }}>
                            <option value="">Todas</option>
                            {opcionesCategoria.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </label>
                    <label>
                        <span className={styles.filterLabel}>Subcategoría</span>
                        <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)}>
                            <option value="">Todas</option>
                            {opcionesSubcategoria.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </label>
                </div>
                <div className={styles.filters}>
                    <label>
                        <input
                            type="radio"
                            checked={filtroEfectivo === 'todos'}
                            onChange={() => setFiltroEfectivo('todos')}
                        />
                        Todas
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={filtroEfectivo === true}
                            onChange={() => setFiltroEfectivo(true)}
                        />
                        Solo efectivo
                    </label>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Deportista</th>
                            <th>Cuota (mes / año)</th>
                            <th>Monto</th>
                            <th>Forma de pago</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listado.map((c) => (
                            <tr key={c.id}>
                                <td>{c.deportistaNombre}</td>
                                <td>{MESES[c.mes - 1]} {c.anio}</td>
                                <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(c.monto)}</td>
                                <td>{c.formaPago === 'efectivo' ? 'Efectivo' : c.formaPago === 'sistema' ? 'Sistema' : '—'}</td>
                                <td>
                                    <span className={c.estadoCuota === 'PAGADA' ? styles.badgePagada : styles.badgePendiente}>
                                        {c.estadoCuota === 'PAGADA' ? 'Pagada' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className={styles.cellActions}>
                                    {c.formaPago === 'efectivo' && c.estadoCuota === 'PENDIENTE' && (
                                        <button
                                            type="button"
                                            className={styles.btnPagar}
                                            onClick={() => marcarComoPagada(c.id)}
                                        >
                                            <CheckCircle size={18} />
                                            Marcar pagada
                                        </button>
                                    )}
                                    {c.estadoCuota === 'PAGADA' && c.fechaPago && (
                                        <span className={styles.fechaPago}>Pagado: {new Date(c.fechaPago).toLocaleDateString('es-AR')}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pendientesEfectivo.length === 0 && listado.length > 0 && filtroEfectivo === true && (
                <p className={styles.empty}>No hay cuotas en efectivo pendientes.</p>
            )}
        </div>
    );
};
