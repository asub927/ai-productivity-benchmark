import React from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>Human + AI</div>
                </div>
                <nav className={styles.nav}>
                    <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
                        Dashboard
                    </a>
                    <a href="#" className={styles.navItem}>
                        Reports
                    </a>
                    <a href="#" className={styles.navItem}>
                        Settings
                    </a>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.topBar}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>
                            <span className={styles.human}>Human</span>
                            <span className={styles.vs}>vs</span>
                            <span className={styles.ai}>Human + AI</span>
                        </h1>
                        <h2 className={styles.subtitle}>Productivity Benchmark</h2>
                    </div>
                    <div className={styles.userProfile}>
                        <span>Demo User</span>
                        <div className={styles.avatar}>DU</div>
                    </div>
                </header>

                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
