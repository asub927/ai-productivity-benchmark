import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <span className={styles.human}>HUMAN</span>
                <span className={styles.vs}>Vs</span>
                <span className={styles.ai}>AI</span>
            </h1>
            <h2 className={styles.subtitle}>Time to Complete Tasks</h2>
        </header>
    );
};

export default Header;
