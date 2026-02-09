import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandingPanel } from '../components/BrandingPanel';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className={styles.loginPage}>
            <BrandingPanel />
            <aside className={styles.formPanel}>
                <LoginForm />
            </aside>
        </div>
    );
};
