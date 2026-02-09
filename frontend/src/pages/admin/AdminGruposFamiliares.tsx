import { useState, useEffect, useMemo } from 'react';
import { UserPlus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { MOCK_GRUPOS_FAMILIARES, MOCK_DEPORTISTAS } from '../../data/admin';
import type { GrupoFamiliarAdmin } from '../../types/admin';
import type { Deportista } from '../../types/admin';
import { useOpcionesAdmin } from '../../context/OpcionesAdminContext';
import styles from './AdminGruposFamiliares.module.css';

type MiembroForm = { deportistaId: number; nombre: string; apellido: string; dni: string };

export const AdminGruposFamiliares = () => {
    const [grupos, setGrupos] = useState<GrupoFamiliarAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'crear' | 'editar' | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<{ miembros: MiembroForm[]; titularDni: string }>({ miembros: [], titularDni: '' });

    const [filtroDisciplina, setFiltroDisciplina] = useState('');
    const [filtroGenero, setFiltroGenero] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroSubcategoria, setFiltroSubcategoria] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const [modalCuotaHermano, setModalCuotaHermano] = useState<{ grupoId: number; valor: number } | null>(null);
    const [inputCuotaHermano, setInputCuotaHermano] = useState('');
    const { disciplinasNombres, generos, getCategoriasOptions, getSubcategoriaOptions } = useOpcionesAdmin();

    useEffect(() => {
        setTimeout(() => {
            setGrupos([...MOCK_GRUPOS_FAMILIARES]);
            setLoading(false);
        }, 300);
    }, []);

    const openCrear = () => {
        setForm({ miembros: [], titularDni: '' });
        setEditingId(null);
        setModal('crear');
        setFiltroDisciplina('');
        setFiltroGenero('');
        setFiltroCategoria('');
        setFiltroSubcategoria('');
        setBusqueda('');
    };

    const openEditar = (g: GrupoFamiliarAdmin) => {
        setForm({
            miembros: g.miembros.map((m) => ({ deportistaId: m.id, nombre: m.nombre, apellido: m.apellido, dni: m.dni })),
            titularDni: g.titularDni || g.miembros[0]?.dni || '',
        });
        setEditingId(g.id);
        setModal('editar');
        setFiltroDisciplina('');
        setFiltroGenero('');
        setFiltroCategoria('');
        setFiltroSubcategoria('');
        setBusqueda('');
    };

    const opcionesCategoria = useMemo(() => getCategoriasOptions(filtroDisciplina, filtroGenero), [filtroDisciplina, filtroGenero, getCategoriasOptions]);
    const opcionesSubcategoria = useMemo(() => getSubcategoriaOptions(filtroDisciplina, filtroGenero, filtroCategoria), [filtroDisciplina, filtroGenero, filtroCategoria, getSubcategoriaOptions]);

    const deportistasFiltrados = useMemo(() => {
        let list = MOCK_DEPORTISTAS.filter((d) => d.activo);
        if (filtroDisciplina) list = list.filter((d) => d.disciplina === filtroDisciplina);
        if (filtroGenero) list = list.filter((d) => d.genero === filtroGenero);
        if (filtroCategoria) list = list.filter((d) => d.categoria === filtroCategoria);
        if (filtroSubcategoria) list = list.filter((d) => d.subcategoria === filtroSubcategoria);
        const q = busqueda.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (d) =>
                    d.nombre.toLowerCase().includes(q) ||
                    d.apellido.toLowerCase().includes(q) ||
                    d.dni.includes(q)
            );
        }
        return list;
    }, [filtroDisciplina, filtroGenero, filtroCategoria, filtroSubcategoria, busqueda]);

    const agregarMiembro = (d: Deportista) => {
        if (form.miembros.some((m) => m.dni === d.dni)) return;
        setForm((f) => ({
            ...f,
            miembros: [...f.miembros, { deportistaId: d.id, nombre: d.nombre, apellido: d.apellido, dni: d.dni }],
            titularDni: f.miembros.length === 0 ? d.dni : f.titularDni,
        }));
    };

    const quitarMiembro = (dni: string) => {
        setForm((f) => {
            const nuevos = f.miembros.filter((m) => m.dni !== dni);
            const nuevoTitular = f.titularDni === dni ? (nuevos[0]?.dni ?? '') : f.titularDni;
            return { ...f, miembros: nuevos, titularDni: nuevoTitular };
        });
    };

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        const miembrosFinal = form.miembros.map((m, idx) => ({ id: idx + 1, nombre: m.nombre, apellido: m.apellido, dni: m.dni }));
        const titularDni = form.titularDni && miembrosFinal.some((m) => m.dni === form.titularDni)
            ? form.titularDni
            : (miembrosFinal[0]?.dni ?? '');
        if (editingId !== null) {
            setGrupos((prev) =>
                prev.map((g) =>
                    g.id === editingId ? { ...g, miembros: miembrosFinal, titularDni } : g
                )
            );
        } else {
            const nuevo: GrupoFamiliarAdmin = {
                id: Math.max(0, ...grupos.map((g) => g.id)) + 1,
                titularDni,
                miembros: miembrosFinal,
            };
            setGrupos((prev) => [...prev, nuevo]);
        }
        setModal(null);
    };

    const borrar = (id: number) => {
        if (window.confirm('¿Borrar este grupo familiar?')) {
            setGrupos((prev) => prev.filter((g) => g.id !== id));
        }
    };

    const abrirModalCuotaHermano = (g: GrupoFamiliarAdmin) => {
        setModalCuotaHermano({ grupoId: g.id, valor: g.cuotaHermano ?? 0 });
        setInputCuotaHermano(String(g.cuotaHermano ?? ''));
    };

    const guardarCuotaHermano = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalCuotaHermano === null) return;
        const valor = Number(inputCuotaHermano.replace(/\D/g, ''));
        if (!Number.isNaN(valor) && valor >= 0) {
            setGrupos((prev) =>
                prev.map((g) =>
                    g.id === modalCuotaHermano.grupoId ? { ...g, cuotaHermano: valor } : g
                )
            );
        }
        setModalCuotaHermano(null);
    };

    if (loading) return <p className={styles.loading}>Cargando...</p>;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Gestión grupo familiar</h2>
            <p className={styles.subtitle}>Crear, modificar y borrar grupos familiares.</p>

            <button type="button" className={styles.btnPrimary} onClick={openCrear}>
                <UserPlus size={20} />
                Crear grupo familiar
            </button>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Titular</th>
                            <th>Miembros</th>
                            <th>Cuota hermano</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map((g) => {
                            const titular = g.miembros.find((m) => m.dni === g.titularDni) || g.miembros[0];
                            return (
                            <tr key={g.id}>
                                <td>
                                    {titular ? `${titular.nombre} ${titular.apellido} (DNI ${titular.dni})` : '—'}
                                </td>
                                <td>
                                    {g.miembros.map((m) => {
                                        const d = MOCK_DEPORTISTAS.find((x) => x.dni === m.dni);
                                        return (
                                            <div key={m.dni} className={styles.miembroLine}>
                                                {m.nombre} {m.apellido} (DNI {m.dni})
                                                {d && ` — ${d.disciplina}, ${d.subcategoria}, ${d.genero}`}
                                            </div>
                                        );
                                    })}
                                </td>
                                <td>
                                    {g.cuotaHermano != null
                                        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(g.cuotaHermano)
                                        : '—'}
                                </td>
                                <td>
                                    <button type="button" className={styles.btnCuotaHermano} onClick={() => abrirModalCuotaHermano(g)}>
                                        <DollarSign size={18} />
                                        Actualizar cuota hermano
                                    </button>
                                    <button type="button" className={styles.btnEdit} onClick={() => openEditar(g)}>
                                        <Pencil size={18} />
                                        Editar
                                    </button>
                                    <button type="button" className={styles.btnDelete} onClick={() => borrar(g.id)}>
                                        <Trash2 size={18} />
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ); })}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className={styles.overlay} onClick={() => setModal(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>{modal === 'crear' ? 'Nuevo grupo familiar' : 'Editar grupo familiar'}</h3>
                        <p className={styles.modalHint}>Filtre y busque entre los deportistas existentes para agregar miembros al grupo.</p>

                        <div className={styles.filtersRow}>
                            <label className={styles.filterItem}>
                                <span className={styles.filterLabel}>Disciplina</span>
                                <select value={filtroDisciplina} onChange={(e) => { setFiltroDisciplina(e.target.value); setFiltroCategoria(''); setFiltroSubcategoria(''); }} className={styles.select}>
                                    <option value="">Todas</option>
                                    {disciplinasNombres.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </label>
                            <label className={styles.filterItem}>
                                <span className={styles.filterLabel}>Género</span>
                                <select value={filtroGenero} onChange={(e) => { setFiltroGenero(e.target.value); setFiltroCategoria(''); setFiltroSubcategoria(''); }} className={styles.select}>
                                    <option value="">Todos</option>
                                    {generos.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </label>
                            <label className={styles.filterItem}>
                                <span className={styles.filterLabel}>Categoría</span>
                                <select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setFiltroSubcategoria(''); }} className={styles.select}>
                                    <option value="">Todas</option>
                                    {opcionesCategoria.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </label>
                            <label className={styles.filterItem}>
                                <span className={styles.filterLabel}>Subcategoría</span>
                                <select value={filtroSubcategoria} onChange={(e) => setFiltroSubcategoria(e.target.value)} className={styles.select}>
                                    <option value="">Todas</option>
                                    {opcionesSubcategoria.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className={styles.field}>
                            <label>Buscar por nombre o DNI</label>
                            <input
                                type="text"
                                placeholder="Nombre, apellido o DNI..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.listaDeportistas}>
                            <strong>Deportistas (agregar al grupo)</strong>
                            <ul className={styles.lista}>
                                {deportistasFiltrados.map((d) => {
                                    const yaAgregado = form.miembros.some((m) => m.dni === d.dni);
                                    return (
                                        <li key={d.id} className={styles.listaItem}>
                                            <span>{d.nombre} {d.apellido} — DNI {d.dni} — {d.disciplina}, {d.subcategoria}, {d.genero}</span>
                                            <button
                                                type="button"
                                                className={styles.btnAddSmall}
                                                onClick={() => agregarMiembro(d)}
                                                disabled={yaAgregado}
                                            >
                                                {yaAgregado ? 'En grupo' : '+ Agregar'}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {deportistasFiltrados.length === 0 && <p className={styles.emptyList}>No hay deportistas que coincidan con los filtros.</p>}
                        </div>

                        <form onSubmit={guardar}>
                            <div className={styles.miembrosSection}>
                                <label>Miembros del grupo</label>
                                {form.miembros.length === 0 ? (
                                    <p className={styles.emptyList}>Agregue al menos un deportista desde la lista anterior.</p>
                                ) : (
                                    <ul className={styles.lista}>
                                        {form.miembros.map((m) => {
                                            const d = MOCK_DEPORTISTAS.find((x) => x.dni === m.dni);
                                            return (
                                                <li key={m.dni} className={styles.listaItem}>
                                                    <span>{m.nombre} {m.apellido} (DNI {m.dni}){d ? ` — ${d.disciplina}, ${d.subcategoria}, ${d.genero}` : ''}</span>
                                                    <button type="button" className={styles.btnRemove} onClick={() => quitarMiembro(m.dni)}>Quitar</button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                            {form.miembros.length > 0 && (
                                <div className={styles.titularSection}>
                                    <label htmlFor="titularDni" className={styles.titularLabel}>Titular (quien paga la cuota) *</label>
                                    <p className={styles.titularHint}>Desde el perfil del titular se abonará la cuota del grupo familiar.</p>
                                    <select
                                        id="titularDni"
                                        className={styles.select}
                                        value={form.titularDni}
                                        onChange={(e) => setForm((f) => ({ ...f, titularDni: e.target.value }))}
                                        required
                                    >
                                        <option value="">Elegir titular</option>
                                        {form.miembros.map((m) => (
                                            <option key={m.dni} value={m.dni}>{m.nombre} {m.apellido} (DNI {m.dni})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.btnGuardar} disabled={form.miembros.length === 0 || (form.miembros.length > 0 && !form.titularDni)}>Guardar</button>
                                <button type="button" className={styles.btnCancelar} onClick={() => setModal(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalCuotaHermano !== null && (
                <div className={styles.overlay} onClick={() => setModalCuotaHermano(null)}>
                    <div className={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
                        <h3>Actualizar monto cuota hermano</h3>
                        <form onSubmit={guardarCuotaHermano}>
                            <div className={styles.field}>
                                <label>Monto (ARS)</label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={inputCuotaHermano}
                                    onChange={(e) => setInputCuotaHermano(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.btnGuardar}>Guardar</button>
                                <button type="button" className={styles.btnCancelar} onClick={() => setModalCuotaHermano(null)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
