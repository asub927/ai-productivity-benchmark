import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';
import ChatWidget from './ChatWidget';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={styles.container}>
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <button
                        className={styles.toggleButton}
                        onClick={toggleSidebar}
                        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        )}
                    </button>
                </div>
                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                        title="Dashboard"
                        end
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                    <NavLink
                        to="/reports"
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                        title="Reports"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {!isCollapsed && <span>Reports</span>}
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                        title="Projects"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {!isCollapsed && <span>Projects</span>}
                    </NavLink>
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

                <ChatWidget />
            </main>
        </div>
    );
};

export default Layout;
