import { useState } from 'react';
import { KeyRound, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminRestablecerContrasena.module.css';

type TipoCuenta = 'deportista' | 'admin';

export const AdminRestablecerContrasena = () => {
    const { resetDeportistaPassword, resetAdminPassword } = useAuth();
    const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>('deportista');
    const [identificador, setIdentificador] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);
        const id = identificador.trim();
        if (!id) {
            setMensaje({ tipo: 'error', texto: 'Ingrese DNI o documento.' });
            return;
        }
        if (!nuevaContrasena || nuevaContrasena.length < 6) {
            setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }
        if (nuevaContrasena !== confirmarContrasena) {
            setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
            return;
        }

        if (tipoCuenta === 'deportista') {
            const ok = resetDeportistaPassword(id, nuevaContrasena);
            if (ok) {
                setMensaje({
                    tipo: 'ok',
                    texto: 'Contraseña del deportista actualizada. Comuníquela al usuario (por teléfono o en persona).',
                });
                setIdentificador('');
                setNuevaContrasena('');
                setConfirmarContrasena('');
            } else {
                setMensaje({
                    tipo: 'error',
                    texto: 'No existe una cuenta de deportista con ese DNI. Verifique el DNI o cree la cuenta desde Gestión deportistas.',
                });
            }
        } else {
            const ok = resetAdminPassword(id, nuevaContrasena);
            if (ok) {
                setMensaje({
                    tipo: 'ok',
                    texto: 'Contraseña del administrador actualizada. Comuníquela al usuario (por teléfono o en persona).',
                });
                setIdentificador('');
                setNuevaContrasena('');
                setConfirmarContrasena('');
            } else {
                setMensaje({
                    tipo: 'error',
                    texto: 'No existe una cuenta de admin con ese documento. Verifique el documento en Gestión admin.',
                });
            }
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Restablecer contraseña</h2>
            <p className={styles.subtitle}>
                El usuario se identifica en el club o por teléfono con DNI (deportista) o documento (admin).
                Usted define la nueva contraseña y se la comunica al usuario.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label>Tipo de cuenta</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="tipo"
                                value="deportista"
                                checked={tipoCuenta === 'deportista'}
                                onChange={() => {
                                    setTipoCuenta('deportista');
                                    setIdentificador('');
                                    setMensaje(null);
                                }}
                            />
                            <User size={18} />
                            Deportista (DNI)
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="tipo"
                                value="admin"
                                checked={tipoCuenta === 'admin'}
                                onChange={() => {
                                    setTipoCuenta('admin');
                                    setIdentificador('');
                                    setMensaje(null);
                                }}
                            />
                            <Shield size={18} />
                            Administrador (documento)
                        </label>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>{tipoCuenta === 'deportista' ? 'DNI del deportista' : 'Documento del administrador'} *</label>
                    <input
                        type="text"
                        placeholder={tipoCuenta === 'deportista' ? 'Ej: 12345678' : 'Ej: admin, caja'}
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label>Nueva contraseña *</label>
                    <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={nuevaContrasena}
                        onChange={(e) => setNuevaContrasena(e.target.value)}
                        required
                        className={styles.input}
                        minLength={6}
                    />
                </div>

                <div className={styles.field}>
                    <label>Confirmar nueva contraseña *</label>
                    <input
                        type="password"
                        placeholder="Repetir contraseña"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        required
                        className={styles.input}
                        minLength={6}
                    />
                </div>

                {mensaje && (
                    <div className={mensaje.tipo === 'ok' ? styles.mensajeOk : styles.mensajeError}>
                        {mensaje.texto}
                    </div>
                )}

                <div className={styles.formActions}>
                    <button type="submit" className={styles.btnGuardar}>
                        <KeyRound size={18} />
                        Restablecer contraseña
                    </button>
                </div>
            </form>
        </div>
    );
};
