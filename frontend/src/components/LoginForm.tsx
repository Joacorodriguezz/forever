import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreditCard, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginForm.module.css';

interface LoginFormData {
    dni: string;
    password: string;
}

/** Número de WhatsApp del club (con código de país, sin +). Ej: 5492211234567 */
const WHATSAPP_NUMBER = '5492211234567';
const WHATSAPP_MSG = 'Hola, olvidé mi contraseña del portal del club. ¿Me pueden ayudar?';

const loginSchema = yup.object({
    dni: yup.string().required('El DNI es requerido').trim(),
    password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoginError(null);
        setIsLoading(true);
        
        console.log('=== INICIO DE LOGIN ===');
        console.log('Datos del formulario:', data);
        
        try {
            const result = await login(data.dni, data.password);
            
            console.log('Resultado del login:', result);
            
            if (result.success) {
                console.log('✅ Login exitoso, redirigiendo...');
                // Determinar ruta según el email ingresado
                // Si contiene @, probablemente es admin, sino es deportista
                const isAdminLogin = data.dni.includes('@') && data.dni.includes('admin');
                const redirectPath = isAdminLogin ? '/admin' : '/dashboard';
                console.log('Redirigiendo a:', redirectPath);
                navigate(redirectPath);
            } else {
                const errorMsg = result.error || 'Credenciales incorrectas. Revisá el DNI y la contraseña.';
                console.error('❌ Login falló:', errorMsg);
                setLoginError(errorMsg);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('❌ Error en submit:', error);
            setLoginError('Error de conexión. Por favor, intenta nuevamente.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginFormContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>Inicia sesión</h2>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {loginError && (
                        <div className={styles.loginError} role="alert">
                            {loginError}
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label htmlFor="dni" className={styles.label}>
                            DNI
                        </label>
                        <div className={styles.inputWrapper}>
                            <CreditCard className={styles.inputIcon} />
                            <input
                                id="dni"
                                type="text"
                                placeholder="Ingrese su DNI"
                                className={`${styles.input} ${errors.dni ? styles.error : ''}`}
                                {...register('dni')}
                                autoComplete="username"
                            />
                        </div>
                        {errors.dni && (
                            <span className={styles.errorMessage}>{errors.dni.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Ingrese su contraseña"
                                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.togglePassword}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                <span className={styles.toggleLabel}>
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </span>
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                        <div className={styles.forgotWrap}>
                            <span className={styles.forgotText}>¿Olvidaste tu contraseña?</span>
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.forgotLink}
                            >
                                Haz click aquí para contactarte con nosotros
                            </a>
                        </div>
                    </div> 
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <a href="#" className={styles.footerLink}>Privacidad</a>
                    <a href="#" className={styles.footerLink}>Términos</a>
                    <a href="#" className={styles.footerLink}>Ayuda</a>
                </div>

                <p className={styles.copyright}>
                    CLUB FOR EVER DE LA PLATA © 2026 <br />
                </p>
            </div>
        </div>
    );
};
