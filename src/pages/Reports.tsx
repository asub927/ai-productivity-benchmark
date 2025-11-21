import React, { useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import ProductivityChart from '../components/ProductivityChart';

const Reports: React.FC = () => {
    const { chartData } = useProjects();

    const projectStats = useMemo(() => {
        const stats: { [key: string]: { count: number, totalGain: number } } = {};
        chartData.forEach(d => {
            if (!stats[d.projectName]) {
                stats[d.projectName] = { count: 0, totalGain: 0 };
            }
            const gain = d.aiTime > 0 ? d.humanTime / d.aiTime : 0;
            stats[d.projectName].count += 1;
            stats[d.projectName].totalGain += gain;
        });
        return Object.entries(stats).map(([name, data]) => ({
            name,
            count: data.count,
            avgGain: data.count > 0 ? data.totalGain / data.count : 0
        }));
    }, [chartData]);

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>Reports</h1>

            {chartData.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    color: '#64748b',
                    border: '1px solid #e2e8f0'
                }}>
                    <p>No data available yet. Add tasks on the Dashboard or via Chat to see reports.</p>
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <ProductivityChart data={chartData} />

                    <div style={{ marginTop: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>Overall Performance</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '8px' }}>Total Tasks</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{chartData.length}</p>
                            </div>
                            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '8px' }}>Avg. Productivity Gain</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                                    {(chartData.reduce((acc, curr) => {
                                        const gain = curr.aiTime > 0 ? curr.humanTime / curr.aiTime : 0;
                                        return acc + gain;
                                    }, 0) / (chartData.length || 1)).toFixed(1)}x
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '48px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>Project Breakdown</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {projectStats.map(stat => (
                                <div key={stat.name} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>{stat.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ color: '#64748b' }}>Tasks</span>
                                        <span style={{ fontWeight: '600', color: '#0f172a' }}>{stat.count}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Avg. Gain</span>
                                        <span style={{ fontWeight: 'bold', color: '#10b981' }}>{stat.avgGain.toFixed(1)}x</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
