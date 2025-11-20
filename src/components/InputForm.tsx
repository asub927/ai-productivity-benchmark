import React, { useState, useEffect } from 'react';
import { InputFormProps, TaskData } from '../types';
import { useProjects } from '../context/ProjectContext';
import styles from './InputForm.module.css';
import { Link } from 'react-router-dom';

const InputForm: React.FC<InputFormProps> = ({ onAddTask, onClear }) => {
    const { projects } = useProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [task, setTask] = useState<string>('');
    const [humanTime, setHumanTime] = useState<string>('');
    const [aiTime, setAiTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Reset task when project changes
    useEffect(() => {
        setTask('');
    }, [selectedProjectId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');

        if (selectedProject && task && humanTime && aiTime) {
            const hTime = parseInt(humanTime);
            const aTime = parseInt(aiTime);

            if (hTime < 0 || aTime < 0) {
                setError("Time values cannot be negative");
                return;
            }

            const newTask: TaskData = {
                projectName: selectedProject.name,
                task: task,
                humanTime: hTime,
                aiTime: aTime,
            };

            onAddTask(newTask);
            // Keep project selected for easier multiple entry
            setTask('');
            setHumanTime('');
            setAiTime('');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputsContainer}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Project Name</label>
                    {projects.length > 0 ? (
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    ) : (
                        <div className={styles.noProjects}>
                            <Link to="/projects" className={styles.link}>Create a Project first</Link>
                        </div>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Activity</label>
                    <select
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className={styles.select}
                        required
                        disabled={!selectedProjectId}
                    >
                        <option value="">Select Activity</option>
                        {selectedProject?.tasks.map((t, index) => (
                            <option key={index} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Human + AI</label>
                    <input
                        type="number"
                        placeholder="Enter time in minutes"
                        value={aiTime}
                        onChange={(e) => setAiTime(e.target.value)}
                        className={styles.input}
                        min="0"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Human Only</label>
                    <input
                        type="number"
                        placeholder="Enter time in minutes"
                        value={humanTime}
                        onChange={(e) => setHumanTime(e.target.value)}
                        className={styles.input}
                        min="0"
                        required
                    />
                </div>
            </div>

            <div className={styles.buttonsContainer}>
                <button type="submit" className={styles.button} disabled={!selectedProjectId || !task}>Add Task</button>
                <button
                    type="button"
                    className={`${styles.button} ${styles.clearButton}`}
                    onClick={onClear}
                >
                    Clear All
                </button>
            </div>
            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default InputForm;
