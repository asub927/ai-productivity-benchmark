import React, { useMemo, useState } from 'react';
import { TaskData } from '../types';

interface ProductivityChartProps {
    data: TaskData[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
    // 1. Group data by project
    const projectData = useMemo(() => {
        const groups: { [key: string]: { task: string, gain: number }[] } = {};
        data.forEach(d => {
            if (!groups[d.projectName]) {
                groups[d.projectName] = [];
            }
            // Calculate Gain: Human Time / AI Time (Multiplier)
            // e.g. 100 min human / 10 min AI = 10x gain
            const gain = d.aiTime > 0 ? d.humanTime / d.aiTime : 0;
            groups[d.projectName].push({ task: d.task, gain });
        });
        return groups;
    }, [data]);

    const projects = Object.keys(projectData);

    // Colors for different projects (Blue variations)
    const colors = [
        '#06b6d4', // Cyan
        '#3b82f6', // Blue
        '#1d4ed8', // Dark Blue
        '#0ea5e9', // Sky Blue
        '#6366f1', // Indigo
        '#0f172a', // Slate
    ];

    // Chart Dimensions
    const width = 800;
    const height = 400;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Scales
    // X-axis: Task Index (0 to maxTasks - 1)
    const maxTasks = Math.max(...Object.values(projectData).map(arr => arr.length), 1);

    // Y-axis: Gain (0 to 10x fixed, or max if higher)
    const allGains = data.map(d => d.aiTime > 0 ? d.humanTime / d.aiTime : 0);
    const maxGain = Math.max(10, ...allGains); // At least 10x
    const minGain = 0;

    const getX = (index: number) => padding + (index / (maxTasks > 1 ? maxTasks - 1 : 1)) * chartWidth;
    const getY = (gain: number) => height - padding - ((gain - minGain) / (maxGain - minGain)) * chartHeight;

    // Generate Paths
    const paths = projects.map((project, i) => {
        const points = projectData[project].map((d, idx) => ({
            x: getX(idx),
            y: getY(d.gain)
        }));

        if (points.length === 0) return '';

        // Smooth Curve (Catmull-Rom or simple Bezier)
        // For simplicity, let's use a basic smoothing
        if (points.length === 1) {
            return `M ${points[0].x} ${points[0].y} Z`; // Single point
        }

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let j = 0; j < points.length - 1; j++) {
            const p0 = points[j === 0 ? 0 : j - 1];
            const p1 = points[j];
            const p2 = points[j + 1];
            const p3 = points[j + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 3;
            const cp1y = p1.y + (p2.y - p0.y) / 3;

            const cp2x = p2.x - (p3.x - p1.x) / 3;
            const cp2y = p2.y - (p3.y - p1.y) / 3;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        return d;
    });

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            color: '#1e293b',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Productivity Boost (Projects)</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {projects.map((project, i) => (
                        <div key={project} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                            <div style={{ width: '12px', height: '4px', borderRadius: '2px', backgroundColor: colors[i % colors.length] }} />
                            <span style={{ color: '#64748b' }}>{project}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingBottom: '50%' }}>
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                    {/* Grid Lines (Y-axis) - 0 to 10 */}
                    {Array.from({ length: 11 }).map((_, i) => {
                        const tick = i; // 0, 1, 2 ... 10
                        if (tick > maxGain) return null;
                        const y = getY(tick);
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fill="#64748b"
                                    fontSize="12"
                                >
                                    {tick}x
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis Labels (Task Indices) */}
                    {Array.from({ length: maxTasks }).map((_, i) => {
                        const x = getX(i);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - padding + 20}
                                textAnchor="middle"
                                fill="#64748b"
                                fontSize="12"
                            >
                                Task {i + 1}
                            </text>
                        );
                    })}

                    {/* Lines */}
                    {paths.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke={colors[i % colors.length]}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {/* Median Vertical Line */}
                    {(() => {
                        const medianIndex = Math.floor((maxTasks - 1) / 2);
                        const x = getX(medianIndex);
                        return (
                            <g>
                                <line
                                    x1={x}
                                    y1={padding}
                                    x2={x}
                                    y2={height - padding}
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={x}
                                    y={padding - 10}
                                    textAnchor="middle"
                                    fill="#94a3b8"
                                    fontSize="12"
                                >
                                    Median
                                </text>
                            </g>
                        );
                    })()}

                    {/* Dots and Labels */}
                    {projects.map((project, i) => (
                        projectData[project].map((d, idx) => {
                            const isMedian = idx === Math.floor((maxTasks - 1) / 2);
                            const pointKey = `${i}-${idx}`;
                            const isHovered = hoveredPoint === pointKey;

                            return (
                                <g
                                    key={pointKey}
                                    onMouseEnter={() => setHoveredPoint(pointKey)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <circle
                                        cx={getX(idx)}
                                        cy={getY(d.gain)}
                                        r={isMedian ? 6 : 4}
                                        fill="white"
                                        stroke={colors[i % colors.length]}
                                        strokeWidth={isMedian ? 3 : 2}
                                    />
                                    {isMedian ? (
                                        <g transform={`translate(${getX(idx)}, ${getY(d.gain)})`}>
                                            <rect
                                                x="10"
                                                y="-12"
                                                width="40"
                                                height="24"
                                                rx="4"
                                                fill={colors[i % colors.length]}
                                            />
                                            <text
                                                x="30"
                                                y="4"
                                                textAnchor="middle"
                                                fill="white"
                                                fontSize="12"
                                                fontWeight="bold"
                                            >
                                                {d.gain.toFixed(1)}x
                                            </text>
                                        </g>
                                    ) : isHovered && (
                                        <text
                                            x={getX(idx)}
                                            y={getY(d.gain) - 12}
                                            textAnchor="middle"
                                            fill={colors[i % colors.length]}
                                            fontSize="11"
                                            fontWeight="600"
                                        >
                                            {d.gain.toFixed(1)}x
                                        </text>
                                    )}
                                </g>
                            );
                        })
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default ProductivityChart;
