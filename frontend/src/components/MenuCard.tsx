import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './MenuCard.module.css';

interface MenuItem {
    label: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: 'Mi Perfil', path: '/perfil' },
    { label: 'Estado Deuda', path: '/estado-deuda' },
    { label: 'Cuotas', path: '/cuotas' },
    { label: 'Historial de Pagos', path: '/historial-pagos' },
    { label: 'Grupo Familiar', path: '/grupo-familiar' },
];

export const MenuCard = () => {
    const navigate = useNavigate();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles.menuCard}>
            <div className={styles.menuHeader}>
                <h2 className={styles.menuTitle}>SOCIOS</h2>
                <p className={styles.menuSubtitle}>Sistema de Gestión</p>
            </div>

            <nav className={styles.menuList}>
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={styles.menuItem}
                        onClick={() => handleMenuClick(item.path)}
                    >
                        {item.label}
                        <ChevronRight className={styles.menuItemIcon} size={20} />
                    </button>
                ))}
            </nav>
        </div>
    );
};
