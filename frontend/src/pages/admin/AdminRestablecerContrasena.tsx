import { useState } from 'react';
import { KeyRound, User, Shield } from 'lucide-react';
import { deportistaService } from '../../services/deportista.service';
import styles from './AdminRestablecerContrasena.module.css';

type TipoCuenta = 'deportista' | 'admin';

export const AdminRestablecerContrasena = () => {
    const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>('deportista');
    const [identificador, setIdentificador] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);
        const dni = identificador.trim();
        if (!dni) {
            setMensaje({ tipo: 'error', texto: 'Ingrese el DNI del usuario.' });
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

        setLoading(true);

        try {
            if (tipoCuenta === 'deportista') {
                const response = await deportistaService.resetPasswordByDni(dni, nuevaContrasena);
                if (response.success) {
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
                        texto: 'Error al restablecer contraseña. Verifique el DNI.',
                    });
                }
            } else {
                // TODO: Implementar reset password para admin cuando el endpoint esté disponible
                setMensaje({
                    tipo: 'error',
                    texto: 'Funcionalidad de reset para admin en desarrollo. Por favor, usa la gestión de administradores.',
                });
            }
        } catch (error: any) {
            console.error('Error al restablecer contraseña:', error);
            setMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || 'Error al restablecer contraseña.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Restablecer contraseña</h2>
            <p className={styles.subtitle}>
                El usuario se identifica en el club o por teléfono con DNI (deportista) o documento (admin).
                Usted ingresa el DNI del usuario y define la nueva contraseña.
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
                            Deportista
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
                            Administrador
                        </label>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>DNI del {tipoCuenta === 'deportista' ? 'deportista' : 'administrador'} *</label>
                    <input
                        type="text"
                        placeholder={tipoCuenta === 'deportista' ? 'DNI del deportista' : 'DNI del administrador'}
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
