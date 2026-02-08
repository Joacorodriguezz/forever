import styles from './BrandingPanel.module.css';

export const BrandingPanel = () => {
    return (
        <div className={styles.brandingPanel}>
            <div className={styles.logoContainer}>
                <img src="/logo.png" alt="Club For Ever" className={styles.logo} />
                <h1 className={styles.clubName}>FOR EVER</h1>
            </div>

            <h1 className={styles.heading}>Orgullo de La Plata.</h1>

            <p className={styles.description}>
                Bienvenido al portal oficial de socios. Gestioná tu cuota,
                participá en las actividades y seguí fortaleciendo el club
                de nuestro barrio.
            </p>
        </div>
    );
};
