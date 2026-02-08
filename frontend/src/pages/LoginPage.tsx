import { BrandingPanel } from '../components/BrandingPanel';
import { LoginForm } from '../components/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    return (
        <div className={styles.loginPage}>
            <BrandingPanel />
            <LoginForm />
        </div>
    );
};
