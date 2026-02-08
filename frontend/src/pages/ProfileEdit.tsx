import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Save, CheckCircle, XCircle } from 'lucide-react';
import { Footer } from '../components/Footer';
import styles from './ProfileEdit.module.css';

const profileSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    dni: yup.string().required('El DNI es requerido'),
    fechaNac: yup.string().required('La fecha de nacimiento es requerida'),
    categoria: yup.string(),
    obraSocial: yup.string(),
    enfermedades: yup.string(),
    telefonos: yup.string(),
    domicilio: yup.object({
        calle: yup.string().required('La calle es requerida'),
        numero: yup.string().required('El número es requerido'),
        piso: yup.string(),
        departamento: yup.string(),
    }).required(),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

interface ProfileData extends ProfileFormData {
    email: string;
    disciplina: string;
    estado: string;
}

export const ProfileEdit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema) as any,
    });

    useEffect(() => {
        // TODO: Fetch profile data from backend
        // For now, using mock data
        const mockData: ProfileData = {
            nombre: 'Juan',
            apellido: 'Pérez',
            dni: '12345678',
            fechaNac: '1990-01-15',
            categoria: 'Primera',
            obraSocial: 'OSDE',
            enfermedades: '',
            telefonos: '221-123-4567',
            domicilio: {
                calle: 'Calle 50',
                numero: '123',
                piso: '2',
                departamento: 'A',
            },
            email: 'juan.perez@email.com',
            disciplina: 'Fútbol',
            estado: 'AL_DIA',
        };

        setProfileData(mockData);
        reset(mockData);
        setLoading(false);
    }, [reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            // TODO: Send PUT request to backend
            console.log('Saving profile:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setNotification({ type: 'success', message: 'Perfil actualizado correctamente' });
            setIsEditing(false);
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setNotification({ type: 'error', message: 'Error al actualizar el perfil' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (profileData) {
            reset(profileData);
        }
    };

    if (loading) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.container}>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} />
                        Volver al Dashboard
                    </button>
                    <h1 className={styles.title}>Mi Perfil</h1>
                    <p className={styles.subtitle}>
                        {isEditing ? 'Editá tu información personal' : 'Visualizá tu información personal'}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formCard}>
                        {/* Información Personal */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información Personal</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="nombre" className={styles.label}>
                                        Nombre *
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        className={`${styles.input} ${errors.nombre ? styles.error : ''}`}
                                        {...register('nombre')}
                                        disabled={!isEditing}
                                    />
                                    {errors.nombre && (
                                        <span className={styles.errorMessage}>{errors.nombre.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="apellido" className={styles.label}>
                                        Apellido *
                                    </label>
                                    <input
                                        id="apellido"
                                        type="text"
                                        className={`${styles.input} ${errors.apellido ? styles.error : ''}`}
                                        {...register('apellido')}
                                        disabled={!isEditing}
                                    />
                                    {errors.apellido && (
                                        <span className={styles.errorMessage}>{errors.apellido.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="dni" className={styles.label}>
                                        DNI *
                                    </label>
                                    <input
                                        id="dni"
                                        type="text"
                                        className={`${styles.input} ${errors.dni ? styles.error : ''}`}
                                        {...register('dni')}
                                        disabled={!isEditing}
                                    />
                                    {errors.dni && (
                                        <span className={styles.errorMessage}>{errors.dni.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="fechaNac" className={styles.label}>
                                        Fecha de Nacimiento *
                                    </label>
                                    <input
                                        id="fechaNac"
                                        type="date"
                                        className={`${styles.input} ${errors.fechaNac ? styles.error : ''}`}
                                        {...register('fechaNac')}
                                        disabled={!isEditing}
                                    />
                                    {errors.fechaNac && (
                                        <span className={styles.errorMessage}>{errors.fechaNac.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email
                                        <span className={styles.readOnlyBadge}>Solo lectura</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={styles.input}
                                        value={profileData?.email || ''}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información del Club */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información del Club</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="disciplina" className={styles.label}>
                                        Disciplina
                                        <span className={styles.readOnlyBadge}>Solo lectura</span>
                                    </label>
                                    <input
                                        id="disciplina"
                                        type="text"
                                        className={styles.input}
                                        value={profileData?.disciplina || ''}
                                        disabled
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="categoria" className={styles.label}>
                                        Categoría
                                    </label>
                                    <input
                                        id="categoria"
                                        type="text"
                                        className={styles.input}
                                        {...register('categoria')}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="estado" className={styles.label}>
                                        Estado de Cuenta
                                        <span className={styles.readOnlyBadge}>Solo lectura</span>
                                    </label>
                                    <input
                                        id="estado"
                                        type="text"
                                        className={styles.input}
                                        value={profileData?.estado || ''}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información Médica */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información Médica</h2>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <label htmlFor="obraSocial" className={styles.label}>
                                        Obra Social
                                    </label>
                                    <input
                                        id="obraSocial"
                                        type="text"
                                        className={styles.input}
                                        {...register('obraSocial')}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <label htmlFor="enfermedades" className={styles.label}>
                                        Enfermedades / Condiciones Médicas
                                    </label>
                                    <textarea
                                        id="enfermedades"
                                        className={`${styles.input} ${styles.textarea}`}
                                        {...register('enfermedades')}
                                        placeholder="Ingresá cualquier condición médica relevante..."
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información de Contacto</h2>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <label htmlFor="telefonos" className={styles.label}>
                                        Teléfonos
                                    </label>
                                    <input
                                        id="telefonos"
                                        type="text"
                                        className={styles.input}
                                        {...register('telefonos')}
                                        placeholder="Ej: 221-123-4567, 221-987-6543"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="calle" className={styles.label}>
                                        Calle *
                                    </label>
                                    <input
                                        id="calle"
                                        type="text"
                                        className={`${styles.input} ${errors.domicilio?.calle ? styles.error : ''}`}
                                        {...register('domicilio.calle')}
                                        disabled={!isEditing}
                                    />
                                    {errors.domicilio?.calle && (
                                        <span className={styles.errorMessage}>{errors.domicilio.calle.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="numero" className={styles.label}>
                                        Número *
                                    </label>
                                    <input
                                        id="numero"
                                        type="text"
                                        className={`${styles.input} ${errors.domicilio?.numero ? styles.error : ''}`}
                                        {...register('domicilio.numero')}
                                        disabled={!isEditing}
                                    />
                                    {errors.domicilio?.numero && (
                                        <span className={styles.errorMessage}>{errors.domicilio.numero.message}</span>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="piso" className={styles.label}>
                                        Piso
                                    </label>
                                    <input
                                        id="piso"
                                        type="text"
                                        className={styles.input}
                                        {...register('domicilio.piso')}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="departamento" className={styles.label}>
                                        Departamento
                                    </label>
                                    <input
                                        id="departamento"
                                        type="text"
                                        className={styles.input}
                                        {...register('domicilio.departamento')}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    className={`${styles.button} ${styles.buttonPrimary}`}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar Perfil
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={`${styles.button} ${styles.buttonSecondary}`}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={`${styles.button} ${styles.buttonPrimary}`}
                                        disabled={isSubmitting}
                                    >
                                        <Save size={20} />
                                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`${styles.notification} ${notification.type === 'success' ? styles.notificationSuccess : styles.notificationError}`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {notification.message}
                </div>
            )}

            <Footer />
        </div>
    );
};
