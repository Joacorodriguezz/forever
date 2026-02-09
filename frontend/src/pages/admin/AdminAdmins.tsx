import { useState, useEffect } from 'react';
import { UserPlus, Pencil } from 'lucide-react';
import { MOCK_ADMINS } from '../../data/admin';
import type { AdminUser } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminAdmins.module.css';

export const AdminAdmins = () => {
    const { setAdminPassword } = useAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ documento: '', contraseña: '', nombre: '' });

    useEffect(() => {
        setTimeout(() => {
            setAdmins([...MOCK_ADMINS]);
            setLoading(false);
        }, 300);
    }, []);

    const openCrear = () => {
        setForm({ documento: '', contraseña: '', nombre: '' });
        setEditingId(null);
        setShowForm(true);
    };

    const openEditar = (a: AdminUser) => {
        setForm({ documento: a.documento, contraseña: '', nombre: a.nombre });
        setEditingId(a.id);
        setShowForm(true);
    };

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        const doc = form.documento.trim();
        if (editingId !== null) {
            setAdmins((prev) =>
                prev.map((a) =>
                    a.id === editingId
                        ? { ...a, documento: doc, nombre: form.nombre.trim() }
                        : a
                )
            );
            if (form.contraseña) setAdminPassword(doc, form.contraseña);
        } else {
            const nuevo: AdminUser = {
                id: Math.max(0, ...admins.map((a) => a.id)) + 1,
                documento: doc,
                nombre: form.nombre.trim() || doc,
                activo: true,
            };
            setAdmins((prev) => [...prev, nuevo]);
            if (form.contraseña) setAdminPassword(doc, form.contraseña);
        }
        setShowForm(false);
    };

    const toggleActivo = (id: number) => {
        setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, activo: !a.activo } : a)));
    };

    if (loading) return <p className={styles.loading}>Cargando...</p>;

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Gestión admin</h2>
            <p className={styles.subtitle}>Administrar usuarios con acceso al panel.</p>

            {!showForm ? (
                <button type="button" className={styles.btnPrimary} onClick={openCrear}>
                    <UserPlus size={20} />
                    Crear admin
                </button>
            ) : (
                <form onSubmit={guardar} className={styles.form}>
                    <h3 className={styles.formTitle}>{editingId ? 'Editar admin' : 'Nuevo admin'}</h3>
                    <div className={styles.field}>
                        <label>Documento del administrador *</label>
                        <input
                            type="text"
                            placeholder="Ej: DNI o número de documento"
                            value={form.documento}
                            onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value }))}
                            required
                            className={styles.input}
                        />
                    </div>
                    {editingId === null && (
                        <div className={styles.field}>
                            <label>Contraseña *</label>
                            <input
                                type="password"
                                placeholder="Contraseña que se le proporciona al admin"
                                value={form.contraseña}
                                onChange={(e) => setForm((f) => ({ ...f, contraseña: e.target.value }))}
                                required
                                className={styles.input}
                                minLength={6}
                            />
                        </div>
                    )}
                    {editingId !== null && (
                        <div className={styles.field}>
                            <label>Nueva contraseña (opcional)</label>
                            <input
                                type="password"
                                placeholder="Dejar en blanco para no cambiar"
                                value={form.contraseña}
                                onChange={(e) => setForm((f) => ({ ...f, contraseña: e.target.value }))}
                                className={styles.input}
                            />
                        </div>
                    )}
                    <div className={styles.field}>
                        <label>Nombre (para mostrar)</label>
                        <input
                            type="text"
                            placeholder="Ej: Administrador Principal"
                            value={form.nombre}
                            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnGuardar}>Guardar</button>
                        <button type="button" className={styles.btnCancelar} onClick={() => setShowForm(false)}>Cancelar</button>
                    </div>
                </form>
            )}

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a.id}>
                                <td>{a.documento}</td>
                                <td>{a.nombre}</td>
                                <td>
                                    <span className={a.activo ? styles.badgeActivo : styles.badgeInactivo}>
                                        {a.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <button type="button" className={styles.btnEdit} onClick={() => openEditar(a)}>
                                        <Pencil size={18} />
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className={a.activo ? styles.btnDesactivar : styles.btnToggle}
                                        onClick={() => toggleActivo(a.id)}
                                    >
                                        {a.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
