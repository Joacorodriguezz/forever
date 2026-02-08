import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { MenuCard } from '../components/MenuCard';
import { Footer } from '../components/Footer';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session data if needed
        localStorage.removeItem('token'); // Placeholder for future auth
        navigate('/');
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.imageHeader}>
                <button className={styles.logoutButton} onClick={handleLogout} title="Cerrar sesión">
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                </button>
            </div>

            <div className={styles.dashboardContent}>
                <div className={styles.menuCardWrapper}>
                    <MenuCard />
                </div>
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};
