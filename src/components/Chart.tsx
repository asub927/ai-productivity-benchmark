import React from 'react';
import { ChartProps } from '../types';
import styles from './Chart.module.css';

const Chart: React.FC<ChartProps> = ({ data, onDeleteTask }) => {
    const maxTime = Math.max(...data.map(d => Math.max(d.humanTime, d.aiTime)), 1);

    // Calculate legend positions based on the first task's values
    // This aligns the legends with the data labels of the first task
    const firstTaskAiTime = data.length > 0 ? data[0].aiTime : 0;
    const firstTaskHumanTime = data.length > 0 ? data[0].humanTime : 0;

    const aiDotPercent = (firstTaskAiTime / maxTime) * 100;
    const humanDotPercent = (firstTaskHumanTime / maxTime) * 100;

    // Calculate legend positions accounting for the offset
    const aiLegendPosition = aiDotPercent;
    const humanLegendPosition = humanDotPercent;

    // Legend Collision Detection
    const percentDiff = Math.abs(aiLegendPosition - humanLegendPosition);
    const isLegendOverlapping = percentDiff < 30;

    let aiLegendShift = 0;
    let humanLegendShift = 0;

    if (isLegendOverlapping) {
        // Shift away from each other
        // BUT check if we are near the edges to avoid overflow

        // If AI is on the left of Human
        if (aiLegendPosition < humanLegendPosition) {
            // AI shifts Left, Human shifts Right
            // Check if Human is too far right (e.g. > 80%)
            if (humanLegendPosition > 80) {
                // Cannot shift Human right. Shift AI further left?
                // Or shift both left?
                aiLegendShift = -50;
                humanLegendShift = -10; // Shift Human slightly left instead of right
            } else {
                aiLegendShift = -40;
                humanLegendShift = 40;
            }
        } else {
            // AI shifts Right, Human shifts Left
            // Check if AI is too far right
            if (aiLegendPosition > 80) {
                aiLegendShift = -10; // Shift AI slightly left
                humanLegendShift = -50; // Shift Human further left
            } else {
                aiLegendShift = 40;
                humanLegendShift = -40;
            }
        }
    }

    // Additional Clamp: If any legend is extremely close to 100% (e.g. > 85%), 
    // ensure its internal transform pulls it back.
    if (!isLegendOverlapping) {
        if (humanLegendPosition > 85) {
            humanLegendShift = -40; // Pull back left
        } else if (humanLegendPosition < 15) {
            humanLegendShift = 40; // Push right
        }

        if (aiLegendPosition > 85) {
            aiLegendShift = -40; // Pull back left
        } else if (aiLegendPosition < 15) {
            aiLegendShift = 40; // Push right
        }
    } else {
        // If overlapping AND near edge, we need to be careful
        // (The previous logic handled some of this, but let's refine it)
        // If Human is at 100% and AI is at 95%, they overlap.
        // We want Human to be -50 (left) and AI to be -100 (further left)? 
        // Or Human -40 (left) and AI -90?
        // The current overlap logic shifts them apart by +/- 40.
        // If we are at the right edge, we can't shift Right.

        // Re-evaluating overlap logic for edges:
        if (aiLegendPosition < humanLegendPosition) {
            // AI Left, Human Right
            if (humanLegendPosition > 85) {
                // Human is at edge, force it Left
                humanLegendShift = -40;
                // AI must go further Left
                aiLegendShift = -90;
            }
        } else {
            // AI Right, Human Left
            if (aiLegendPosition > 85) {
                aiLegendShift = -40;
                humanLegendShift = -90;
            }
        }
    }

    // (The logic above handles the overlap case. For non-overlap, shifts are 0, so standard centering applies).

    return (
        <div className={styles.chartContainer}>
            {data.length > 0 && (
                <div className={styles.legendContainer}>
                    {/* AI Legend */}
                    <div
                        className={styles.legendItem}
                        style={{
                            left: `${aiLegendPosition}%`,
                            zIndex: aiLegendPosition < humanLegendPosition ? 2 : 1
                        }}
                    >
                        <div
                            className={styles.legendBoxAi}
                            style={{ transform: `translateX(${aiLegendShift}%)` }}
                        >
                            Human + AI
                        </div>
                        <div className={styles.legendArrowAi}></div>
                    </div>

                    {/* Human Legend */}
                    <div
                        className={styles.legendItem}
                        style={{
                            left: `${humanLegendPosition}%`,
                            zIndex: aiLegendPosition > humanLegendPosition ? 2 : 1
                        }}
                    >
                        <div
                            className={styles.legendBoxHuman}
                            style={{ transform: `translateX(${humanLegendShift}%)` }}
                        >
                            Human Only
                        </div>
                        <div className={styles.legendArrowHuman}></div>
                    </div>
                </div>
            )}


            <div className={styles.chart}>
                {data.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No tasks yet.</p>
                        <p>Enter a task above to see the productivity boost with AI.</p>
                    </div>
                ) : (

                    data.map((item, index) => {
                        const humanPercent = (item.humanTime / maxTime) * 100;
                        const aiPercent = (item.aiTime / maxTime) * 100;

                        // Check for overlap between labels
                        // If values are close (e.g. within 8% of maxTime), labels might overlap
                        const isOverlapping = Math.abs(humanPercent - aiPercent) < 8;

                        // Check if labels overlap with the connecting line
                        // Overlap occurs if:
                        // 1. AI < Human (Line to Right) AND AI Label is Right
                        // 2. AI > Human (Line to Left) AND AI Label is Left
                        // Same logic applies to Human label

                        // We need to determine label classes first to check for line overlap
                        // Thresholds for edge cases
                        const MIN_PERCENT_FOR_LEFT_LABEL = 25;
                        const MAX_PERCENT_FOR_RIGHT_LABEL = 80;

                        let aiLabelClass = styles.labelRight;
                        let humanLabelClass = styles.labelLeft;

                        const aiTooSmall = aiPercent < MIN_PERCENT_FOR_LEFT_LABEL;
                        const humanTooSmall = humanPercent < MIN_PERCENT_FOR_LEFT_LABEL;

                        const aiTooLarge = aiPercent > MAX_PERCENT_FOR_RIGHT_LABEL;
                        const humanTooLarge = humanPercent > MAX_PERCENT_FOR_RIGHT_LABEL;

                        // Default Logic: Smaller on Left, Larger on Right
                        if (aiPercent < humanPercent) {
                            if (aiTooSmall && !humanTooSmall) {
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = humanTooLarge ? styles.labelLeft : styles.labelRight;
                            } else {
                                aiLabelClass = styles.labelLeft;
                                humanLabelClass = styles.labelRight;
                            }
                        } else if (aiPercent > humanPercent) {
                            if (humanTooSmall && !aiTooSmall) {
                                humanLabelClass = styles.labelRight;
                                aiLabelClass = aiTooLarge ? styles.labelLeft : styles.labelRight;
                            } else {
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelLeft;
                            }
                        } else {
                            if (aiTooSmall) {
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelRight;
                            } else {
                                aiLabelClass = styles.labelLeft;
                                humanLabelClass = styles.labelRight;
                            }
                        }

                        // OVERRIDE: If any point is too close to the right edge, FORCE it Left
                        if (aiTooLarge) aiLabelClass = styles.labelLeft;
                        if (humanTooLarge) humanLabelClass = styles.labelLeft;

                        return (
                            <div key={index} className={styles.row}>
                                <div className={styles.labelContainer}>
                                    <div className={styles.deleteColumn}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => onDeleteTask(index)}
                                            aria-label={`Delete ${item.task}`}
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className={styles.projectLabel}>{item.projectName}</div>
                                    <div className={styles.taskLabel}>{item.task}</div>
                                </div>
                                <div className={styles.barContainer}>
                                    {/* Connecting Line */}
                                    <div
                                        className={styles.connectingLine}
                                        style={{
                                            left: `${Math.min(humanPercent, aiPercent)}%`,
                                            width: `${Math.abs(humanPercent - aiPercent)}%`
                                        }}
                                    ></div>

                                    {/* AI Dot */}
                                    <div
                                        className={styles.aiDot}
                                        style={{ left: `${aiPercent}%` }}
                                    >
                                        <span
                                            className={`${styles.timeLabelAi} ${aiLabelClass} ${(isOverlapping) ? styles.labelOffsetUp : ''}`}
                                        >
                                            {item.aiTime} min
                                        </span>
                                    </div>

                                    {/* Human Dot */}
                                    <div
                                        className={styles.humanDot}
                                        style={{ left: `${humanPercent}%` }}
                                    >
                                        <span
                                            className={`${styles.timeLabelHuman} ${humanLabelClass} ${(isOverlapping) ? styles.labelOffsetDown : ''}`}
                                        >
                                            {item.humanTime} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div >
    );
};

export default Chart;
