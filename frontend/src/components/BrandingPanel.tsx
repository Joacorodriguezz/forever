import styles from './BrandingPanel.module.css';

export const BrandingPanel = () => {
    return (
        <div className={styles.brandingPanel}>
            <div className={styles.content}>
                <img src="/logo.png" alt="Club For Ever" className={styles.logo} />
                <p className={styles.clubText}>
                    CLUB SOCIAL CULTURAL Y<br />
                    DEPORTIVO FOR EVER
                </p>
            </div>
        </div>
    );
};
