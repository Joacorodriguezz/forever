import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div>
                    <img src="/logo.png" alt="Club For Ever" className={styles.footerLogo} />
                    <div className={styles.footerBrand}>FOR EVER</div>
                </div>

                <div className={styles.footerColumns}>
                    <div className={styles.footerColumn}>
                        <h3>SEDE SOCIAL FOR EVER</h3>
                        <p>At. 73 N° 520 (1900, La Plata</p>
                        <p>Provincia de Buenos Aires</p>
                        <p>t.+54 221) 421 1475 / 25 75</p>
                        <p>t.+54 221) 485 5686 / 6809</p>
                        <p>t.+54 221) 521 1137</p>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>SEDE DEPORTIVA</h3>
                        <p>Calle 485 (Univers) esq. 25</p>
                        <p>(Udaon City Cet</p>
                        <p>Provincia de Buenos Aires</p>
                        <p>t. 54-221 475-7792</p>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>ESTADIO FOR EVER</h3>
                        <p>Calle 483 (Avenid aseguina 26</p>
                        <p>Greater City Pata</p>
                        <p>Provincia de Buenos Aires</p>
                        <p>t. 54-221) 425 0585 / 0925</p>
                    </div>
                </div>

                <div className={styles.copyright}>
                    © 2024 Club For Ever de La Plata. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};
