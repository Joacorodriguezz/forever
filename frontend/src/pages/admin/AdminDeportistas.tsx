import { useState, useEffect, useMemo } from 'react';
import { UserPlus, UserMinus, Pencil, Lock, Plus, Filter } from 'lucide-react';
import { MOCK_DEPORTISTAS } from '../../data/admin';
import type { Deportista, AdultoResponsable } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import { useOpcionesAdmin } from '../../context/OpcionesAdminContext';
import styles from './AdminDeportistas.module.css';

const initialAdulto = (): AdultoResponsable => ({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
});

export const AdminDeportistas = () => {
    const { registerDeportistaAccount } = useAuth();
    const { disciplinasNombres, generos, getCategoriasOptions, getSubcategoriaOptions } = useOpcionesAdmin();
    const [deportistas, setDeportistas] = useState<Deportista[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);
    const primeraDisciplina = disciplinasNombres[0] ?? 'Futbol';
    const primerGenero = generos[0] ?? 'Masculino';
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        disciplina: primeraDisciplina,
        genero: primerGenero,
        categoria: '',
        subcategoria: '',
        adultoResponsable: initialAdulto(),
        password: '',
        passwordConfirm: '',
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [filtroDisciplina, setFiltroDisciplina] = useState<string>('');
    const [filtroGenero, setFiltroGenero] = useState<string>('');
    const [filtroCategoria, setFiltroCategoria] = useState<string>('');
    const [filtroSubcategoria, setFiltroSubcategoria] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            setDeportistas([...MOCK_DEPORTISTAS]);
            setLoading(false);
        }, 300);
    }, []);

    const categoriasFiltroOptions = getCategoriasOptions(filtroDisciplina || primeraDisciplina, filtroGenero || primerGenero);
    const subcategoriasFiltroOptions = getSubcategoriaOptions(filtroDisciplina || '', filtroGenero || '', filtroCategoria);

    const deportistasFiltrados = useMemo(() => {
        return deportistas.filter((d) => {
            const cumpleDisciplina = !filtroDisciplina || d.disciplina === filtroDisciplina;
            const cumpleGenero = !filtroGenero || d.genero === filtroGenero;
            const cumpleCategoria = !filtroCategoria || d.categoria === filtroCategoria;
            const cumpleSubcategoria = !filtroSubcategoria || d.subcategoria === filtroSubcategoria;
            return cumpleDisciplina && cumpleGenero && cumpleCategoria && cumpleSubcategoria;
        });
    }, [deportistas, filtroDisciplina, filtroGenero, filtroCategoria, filtroSubcategoria]);

    const categoriasOptions = getCategoriasOptions(form.disciplina, form.genero);
    const subcategoriaOptions = getSubcategoriaOptions(form.disciplina, form.genero, form.categoria);
    const isMenor = form.categoria === 'Juveniles' || form.categoria === 'Infantiles';

    const resetForm = () => {
        setForm({
            nombre: '',
            apellido: '',
            dni: '',
            disciplina: primeraDisciplina,
            genero: primerGenero,
            categoria: '',
            subcategoria: '',
            adultoResponsable: initialAdulto(),
            password: '',
            passwordConfirm: '',
        });
        setFormError(null);
        setEditingId(null);
        setMode('list');
    };

    const openCreate = () => {
        resetForm();
        setMode('create');
    };

    const openEdit = (d: Deportista) => {
        setForm({
            nombre: d.nombre,
            apellido: d.apellido,
            dni: d.dni,
            disciplina: d.disciplina,
            genero: d.genero,
            categoria: d.categoria,
            subcategoria: d.subcategoria,
            adultoResponsable: d.adultoResponsable ?? initialAdulto(),
            password: '',
            passwordConfirm: '',
        });
        setEditingId(d.id);
        setMode('edit');
    };

    const handleDarDeBaja = (id: number) => {
        if (window.confirm('¿Dar de baja a este deportista?')) {
            setDeportistas((prev) => prev.map((d) => (d.id === id ? { ...d, activo: false } : d)));
        }
    };

    const handleAlta = (id: number) => {
        setDeportistas((prev) => prev.map((d) => (d.id === id ? { ...d, activo: true } : d)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (mode === 'create') {
            if (form.password.length < 6) {
                setFormError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            if (form.password !== form.passwordConfirm) {
                setFormError('La contraseña y la confirmación no coinciden.');
                return;
            }
            if (isMenor) {
                const a = form.adultoResponsable;
                if (!a.nombre.trim() || !a.apellido.trim() || !a.dni.trim() || !a.email.trim() || !a.telefono.trim()) {
                    setFormError('Completá todos los datos del adulto responsable (Infantil/Juvenil).');
                    return;
                }
            }
            const id = Math.max(0, ...deportistas.map((d) => d.id)) + 1;
            const nuevo: Deportista = {
                id,
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                dni: form.dni.trim(),
                disciplina: form.disciplina,
                genero: form.genero,
                categoria: form.categoria,
                subcategoria: form.subcategoria,
                adultoResponsable: isMenor ? { ...form.adultoResponsable } : null,
                activo: true,
            };
            setDeportistas((prev) => [...prev, nuevo]);
            registerDeportistaAccount(form.dni.trim(), form.password, id);
            resetForm();
            return;
        }

        if (mode === 'edit' && editingId !== null) {
            if (isMenor) {
                const a = form.adultoResponsable;
                if (!a.nombre.trim() || !a.apellido.trim() || !a.dni.trim() || !a.email.trim() || !a.telefono.trim()) {
                    setFormError('Completá todos los datos del adulto responsable (Infantil/Juvenil).');
                    return;
                }
            }
            setDeportistas((prev) =>
                prev.map((d) =>
                    d.id === editingId
                        ? {
                              ...d,
                              nombre: form.nombre.trim(),
                              apellido: form.apellido.trim(),
                              dni: form.dni.trim(),
                              disciplina: form.disciplina,
                              genero: form.genero,
                              categoria: form.categoria,
                              subcategoria: form.subcategoria,
                              adultoResponsable: isMenor ? { ...form.adultoResponsable } : null,
                          }
                        : d
                )
            );
            resetForm();
        }
    };

    const updateAdulto = (field: keyof AdultoResponsable, value: string) => {
        setForm((f) => ({
            ...f,
            adultoResponsable: { ...f.adultoResponsable, [field]: value },
        }));
    };

    if (loading) return <p className={styles.loading}>Cargando...</p>;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Gestión deportistas</h2>
            <p className={styles.subtitle}>Crear cuenta para que el deportista pueda ingresar al sistema. Dar de baja / editar.</p>

            {mode === 'list' && (
                <button type="button" className={styles.btnPrimary} onClick={openCreate}>
                    <UserPlus size={20} />
                    Crear deportista (cuenta)
                </button>
            )}

            {(mode === 'create' || mode === 'edit') && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3 className={styles.formTitle}>
                        {mode === 'create' ? 'Nueva cuenta de deportista' : 'Editar deportista'}
                    </h3>
                    {formError && <div className={styles.formError}>{formError}</div>}

                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Nombre *</label>
                            <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} required />
                        </div>
                        <div className={styles.field}>
                            <label>Apellido *</label>
                            <input value={form.apellido} onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))} required />
                        </div>
                        <div className={styles.field}>
                            <label>DNI * (ingreso al sistema con DNI y contraseña)</label>
                            <input
                                value={form.dni}
                                onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
                                required
                                readOnly={mode === 'edit'}
                                title={mode === 'edit' ? 'El DNI no se puede cambiar' : ''}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Disciplina *</label>
                            <select value={form.disciplina} onChange={(e) => setForm((f) => ({ ...f, disciplina: e.target.value, categoria: '', subcategoria: '' }))}>
                                <option value="Futbol">Fútbol</option>
                                <option value="Hockey">Hockey</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Género *</label>
                            <select value={form.genero} onChange={(e) => setForm((f) => ({ ...f, genero: e.target.value, categoria: '', subcategoria: '' }))}>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Categoría *</label>
                            <select
                                value={form.categoria}
                                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value, subcategoria: '' }))}
                                required
                            >
                                <option value="">Seleccionar</option>
                                {categoriasOptions.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Subcategoría *</label>
                            <select
                                value={form.subcategoria}
                                onChange={(e) => setForm((f) => ({ ...f, subcategoria: e.target.value }))}
                                required
                            >
                                <option value="">Seleccionar</option>
                                {subcategoriaOptions.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.adultoSection}>
                        <h4 className={styles.adultoTitle}>Adulto responsable</h4>
                        <p className={styles.adultoNote}>
                            {isMenor
                                ? 'Obligatorio para categoría Infantil o Juvenil. Completá todos los datos.'
                                : 'Si la categoría es Infantil o Juvenil, completá los datos del adulto responsable a continuación.'}
                        </p>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label>Nombre adulto {isMenor && '*'}</label>
                                <input value={form.adultoResponsable.nombre} onChange={(e) => updateAdulto('nombre', e.target.value)} required={isMenor} placeholder={isMenor ? '' : 'Solo si Infantil/Juvenil'} />
                            </div>
                            <div className={styles.field}>
                                <label>Apellido adulto {isMenor && '*'}</label>
                                <input value={form.adultoResponsable.apellido} onChange={(e) => updateAdulto('apellido', e.target.value)} required={isMenor} placeholder={isMenor ? '' : 'Solo si Infantil/Juvenil'} />
                            </div>
                            <div className={styles.field}>
                                <label>DNI adulto {isMenor && '*'}</label>
                                <input value={form.adultoResponsable.dni} onChange={(e) => updateAdulto('dni', e.target.value)} required={isMenor} placeholder={isMenor ? '' : 'Solo si Infantil/Juvenil'} />
                            </div>
                            <div className={styles.field}>
                                <label>Email adulto {isMenor && '*'}</label>
                                <input type="email" value={form.adultoResponsable.email} onChange={(e) => updateAdulto('email', e.target.value)} required={isMenor} placeholder={isMenor ? '' : 'Solo si Infantil/Juvenil'} />
                            </div>
                            <div className={styles.field}>
                                <label>Teléfono adulto {isMenor && '*'}</label>
                                <input value={form.adultoResponsable.telefono} onChange={(e) => updateAdulto('telefono', e.target.value)} required={isMenor} placeholder="Ej. 221-456-7890" />
                            </div>
                        </div>
                    </div>

                    {mode === 'create' && (
                        <div className={styles.passwordSection}>
                            <h4 className={styles.adultoTitle}>Contraseña inicial (el deportista podrá cambiarla después) *</h4>
                            <div className={styles.formGrid}>
                                <div className={styles.field}>
                                    <label>Contraseña *</label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                        required
                                        minLength={6}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Confirmar contraseña *</label>
                                    <input
                                        type="password"
                                        value={form.passwordConfirm}
                                        onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
                                        required
                                        placeholder="Repetir contraseña"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'edit' && (
                        <div className={styles.passwordNotice}>
                            <Lock size={20} />
                            <p>La contraseña es privada. El deportista puede cambiarla desde <strong>Mi Perfil</strong>. No es posible verla ni editarla aquí.</p>
                        </div>
                    )}

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnPrimary}>
                            {mode === 'create' ? 'Crear cuenta' : 'Guardar cambios'}
                        </button>
                        <button type="button" className={styles.btnSecondary} onClick={resetForm}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.filters}>
                <h3 className={styles.filtersTitle}>
                    <Filter size={20} />
                    Filtrar
                </h3>
                <div className={styles.filtersGrid}>
                    <div className={styles.filterField}>
                        <label htmlFor="filtro-disciplina">Disciplina</label>
                        <select
                            id="filtro-disciplina"
                            value={filtroDisciplina}
                            onChange={(e) => {
                                setFiltroDisciplina(e.target.value);
                                setFiltroCategoria('');
                                setFiltroSubcategoria('');
                            }}
                        >
                            <option value="">Todas</option>
                            {disciplinasNombres.map((d) => (
                                <option key={d} value={d}>{d === 'Futbol' ? 'Fútbol' : d}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterField}>
                        <label htmlFor="filtro-genero">Género</label>
                        <select
                            id="filtro-genero"
                            value={filtroGenero}
                            onChange={(e) => {
                                setFiltroGenero(e.target.value);
                                setFiltroCategoria('');
                                setFiltroSubcategoria('');
                            }}
                        >
                            <option value="">Todos</option>
                            {generos.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterField}>
                        <label htmlFor="filtro-categoria">Categoría</label>
                        <select
                            id="filtro-categoria"
                            value={filtroCategoria}
                            onChange={(e) => {
                                setFiltroCategoria(e.target.value);
                                setFiltroSubcategoria('');
                            }}
                        >
                            <option value="">Todas</option>
                            {categoriasFiltroOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterField}>
                        <label htmlFor="filtro-subcategoria">Subcategoría</label>
                        <select
                            id="filtro-subcategoria"
                            value={filtroSubcategoria}
                            onChange={(e) => setFiltroSubcategoria(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {subcategoriasFiltroOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Disciplina</th>
                            <th>Género</th>
                            <th>Categoría</th>
                            <th>Subcategoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deportistasFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={9} className={styles.emptyRow}>
                                    No hay deportistas con los filtros seleccionados.
                                </td>
                            </tr>
                        ) : (
                            deportistasFiltrados.map((d) => (
                            <tr key={d.id}>
                                <td>{d.nombre}</td>
                                <td>{d.apellido}</td>
                                <td>{d.dni}</td>
                                <td>{d.disciplina}</td>
                                <td>{d.genero}</td>
                                <td>{d.categoria}</td>
                                <td>{d.subcategoria}</td>
                                <td>
                                    <span className={d.activo ? styles.badgeActivo : styles.badgeBaja}>
                                        {d.activo ? 'Activo' : 'De baja'}
                                    </span>
                                </td>
                                <td>
                                    <button type="button" className={styles.btnEdit} onClick={() => openEdit(d)} title="Editar">
                                        <Pencil size={18} />
                                        Editar
                                    </button>
                                    {d.activo ? (
                                        <button type="button" className={styles.btnBaja} onClick={() => handleDarDeBaja(d.id)} title="Dar de baja">
                                            <UserMinus size={18} />
                                            Dar de baja
                                        </button>
                                    ) : (
                                        <button type="button" className={styles.btnAlta} onClick={() => handleAlta(d.id)} title="Dar de alta">
                                            <Plus size={18} />
                                            Dar de alta
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
