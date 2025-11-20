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

    const formatTime = (minutes: number): string => {
        if (minutes > 100) {
            return (minutes / 60).toFixed(1) + 'h';
        }
        return minutes + 'm';
    };

    return (
        <header className={styles.header}>
            <div className={styles.statsContainer}>
                {/* Widget 1: Human Only */}
                <div className={styles.widgetWrapper}>
                    <span className={styles.widgetLabel}>Human Only</span>
                    <div className={`${styles.widget} ${styles.widgetHuman}`}>
                        <div className={styles.widgetContent}>
                            <span className={styles.widgetValue}>{formatTime(totalHumanTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Widget 2: Human + AI */}
                <div className={styles.widgetWrapper}>
                    <span className={styles.widgetLabel}>Human + AI</span>
                    <div className={`${styles.widget} ${styles.widgetAi}`}>
                        <div className={styles.widgetContent}>
                            <span className={styles.widgetValue}>{formatTime(totalAiTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Widget 3: Productivity Gain */}
                <div className={styles.widgetWrapper}>
                    <span className={styles.widgetLabel}>Productivity Gain</span>
                    <div className={`${styles.widget} ${styles.widgetGain}`}>
                        <div className={styles.widgetContent}>
                            {totalAiTime > 0 ? (
                                <span className={styles.efficiencyValue}>{speedup}x Faster</span>
                            ) : (
                                <span className={styles.efficiencyValue}>-</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
