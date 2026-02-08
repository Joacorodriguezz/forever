import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import styles from './LoginForm.module.css';

interface LoginFormData {
    email: string;
    password: string;
}

const loginSchema = yup.object({
    email: yup
        .string()
        .required('El email es requerido')
        .email('Ingresá un email válido'),
    password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        console.log('Login data:', data);
        // TODO: Integrate with backend authentication endpoint
        // For now, redirect to dashboard
        navigate('/dashboard');
    };

    return (
        <div className={styles.loginFormContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.formTitle}>Ingreso de Socios</h2>
                <p className={styles.formSubtitle}>
                    Ingresá tus credenciales para acceder a tu cuenta.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} />
                            <input
                                id="email"
                                type="email"
                                placeholder="socio@email.com"
                                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email.message}</span>
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
                                placeholder="••••••••"
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
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Ingresar al Portal
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className={styles.footer}>
                    <a href="#" className={styles.footerLink}>Privacidad</a>
                    <a href="#" className={styles.footerLink}>Términos</a>
                    <a href="#" className={styles.footerLink}>Ayuda</a>
                </div>

                <p className={styles.copyright}>
                    CLUB FOR EVER DE LA PLATA © 2024
                </p>
            </div>
        </div>
    );
};
