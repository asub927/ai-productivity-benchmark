import React from 'react';
import { ChartProps, TaskData } from '../types';
import styles from './Chart.module.css';

const Chart: React.FC<ChartProps> = ({ data }) => {
    const maxTime = Math.max(...data.map(d => Math.max(d.humanTime, d.aiTime)), 1);

    // Calculate positions for the first task (for the legend)
    // We use the first task's data to position the legends
    const firstTask: TaskData = data.length > 0 ? data[0] : { task: '', aiTime: 0, humanTime: 0 };
    const aiDotPercent = (firstTask.aiTime / maxTime) * 100;
    const humanDotPercent = (firstTask.humanTime / maxTime) * 100;

    // Account for the task label area offset
    // The legend container spans the full width (900px max)
    // But the bar container starts after the task labels (200px)
    // So we need to offset the legend positions by this amount
    const LABEL_AREA_WIDTH = 200; // pixels
    const CONTAINER_MAX_WIDTH = 900; // pixels  
    const LABEL_AREA_OFFSET_PERCENT = (LABEL_AREA_WIDTH / CONTAINER_MAX_WIDTH) * 100; // ~22.22%

    // The bar container is 700px wide (900 - 200)
    // The dot percentages are relative to this 700px width
    // To convert to full container percentage: (dotPercent * 700/900) + offset
    const BAR_WIDTH_RATIO = (CONTAINER_MAX_WIDTH - LABEL_AREA_WIDTH) / CONTAINER_MAX_WIDTH; // 700/900 = 0.7778

    // Calculate legend positions accounting for the offset
    const aiLegendPosition = LABEL_AREA_OFFSET_PERCENT + (aiDotPercent * BAR_WIDTH_RATIO);
    const humanLegendPosition = LABEL_AREA_OFFSET_PERCENT + (humanDotPercent * BAR_WIDTH_RATIO);

    // Legend Collision Detection
    // If the legend positions are close, the legends (which are wide) might overlap.
    const percentDiff = Math.abs(aiLegendPosition - humanLegendPosition);
    const isLegendOverlapping = percentDiff < 40; // Threshold for legend overlap

    let aiLegendShift = 0;
    let humanLegendShift = 0;

    if (isLegendOverlapping) {
        // Shift away from each other
        if (aiLegendPosition < humanLegendPosition) {
            aiLegendShift = -15; // Shift AI left
            humanLegendShift = 15; // Shift Human right
        } else {
            aiLegendShift = 15; // Shift AI right
            humanLegendShift = -15; // Shift Human left
        }
    }

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
                            With Generative AI
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
                            Without Generative AI
                        </div>
                        <div className={styles.legendArrowHuman}></div>
                    </div>
                </div>
            )}


            <div className={styles.chart}>
                {data.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No tasks yet.</p>
                        <p>Enter a task above to see the Human vs AI time comparison.</p>
                    </div>
                ) : (
                    data.map((item, index) => {
                        const humanPercent = (item.humanTime / maxTime) * 100;
                        const aiPercent = (item.aiTime / maxTime) * 100;

                        // Check for overlap
                        // If values are close (e.g. within 10% of maxTime), labels might overlap
                        const isOverlapping = Math.abs(humanPercent - aiPercent) < 12;

                        // Minimum percentage threshold to prevent labels from going into task name area
                        // If a value is less than 25%, it might overlap with task names when positioned left
                        const MIN_PERCENT_FOR_LEFT_LABEL = 25;

                        // Determine label positions
                        // Strategy: Smaller value on LEFT, larger on RIGHT, unless value is too small
                        // Special case: if BOTH are below threshold, still use left/right to avoid overlap
                        let aiLabelClass = styles.labelRight;
                        let humanLabelClass = styles.labelLeft;

                        const aiTooSmall = aiPercent < MIN_PERCENT_FOR_LEFT_LABEL;
                        const humanTooSmall = humanPercent < MIN_PERCENT_FOR_LEFT_LABEL;

                        if (aiPercent < humanPercent) {
                            // AI is smaller
                            if (aiTooSmall && !humanTooSmall) {
                                // Only AI is too small - force it RIGHT, Human stays RIGHT
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelRight;
                            } else {
                                // Normal case or both too small - use standard positioning
                                aiLabelClass = styles.labelLeft;
                                humanLabelClass = styles.labelRight;
                            }
                        } else if (aiPercent > humanPercent) {
                            // Human is smaller
                            if (humanTooSmall && !aiTooSmall) {
                                // Only Human is too small - force it RIGHT, AI stays RIGHT
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelRight;
                            } else {
                                // Normal case or both too small - use standard positioning
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelLeft;
                            }
                        } else {
                            // Equal values - default to AI left, Human right (unless both too small)
                            if (aiTooSmall) {
                                // Both are equal and too small - both go RIGHT
                                aiLabelClass = styles.labelRight;
                                humanLabelClass = styles.labelRight;
                            } else {
                                aiLabelClass = styles.labelLeft;
                                humanLabelClass = styles.labelRight;
                            }
                        }

                        return (
                            <div key={index} className={styles.row}>
                                <div className={styles.label}>{item.task}</div>
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
                                            className={`${styles.timeLabelAi} ${aiLabelClass} ${isOverlapping ? styles.labelOffsetUp : ''}`}
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
                                            className={`${styles.timeLabelHuman} ${humanLabelClass} ${isOverlapping ? styles.labelOffsetDown : ''}`}
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
        </div>
    );
};

export default Chart;
