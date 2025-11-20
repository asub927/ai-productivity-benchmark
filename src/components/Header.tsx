import React from 'react';
import styles from './Header.module.css';

import { TaskData } from '../types';

interface HeaderProps {
    data: TaskData[];
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const totalHumanTime = data.reduce((acc, curr) => acc + curr.humanTime, 0);
    const totalAiTime = data.reduce((acc, curr) => acc + curr.aiTime, 0);

    // Calculate efficiency (speedup)
    // Avoid division by zero
    const speedup = totalAiTime > 0 ? (totalHumanTime / totalAiTime).toFixed(1) : '0.0';

    return (
        <header className={styles.header}>
            {/* Left Widget: With AI & Efficiency */}
            <div className={styles.widgetWrapper}>
                <div className={`${styles.widget} ${styles.widgetAi}`}>
                    <div className={styles.widgetContent}>
                        <span className={styles.widgetValue}>{totalAiTime}m</span>
                        {totalAiTime > 0 && (
                            <span className={styles.efficiencyBadge}>{speedup}x Faster</span>
                        )}
                    </div>
                </div>
                <span className={styles.widgetLabel}>With AI</span>
            </div>

            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    <span className={styles.ai}>Ai</span>
                    <span className={styles.vs}>Productivity</span>
                    <span className={styles.human}>Boost</span>
                </h1>
                <h2 className={styles.subtitle}>Compare task completion times with and without AI</h2>
            </div>

            {/* Right Widget: Without AI */}
            <div className={styles.widgetWrapper}>
                <div className={`${styles.widget} ${styles.widgetHuman}`}>
                    <div className={styles.widgetContent}>
                        <span className={styles.widgetValue}>{totalHumanTime}m</span>
                    </div>
                </div>
                <span className={styles.widgetLabel}>Without AI</span>
            </div>
        </header>
    );
};

export default Header;
