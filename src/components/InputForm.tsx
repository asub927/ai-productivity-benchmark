import React, { useState } from 'react';
import { InputFormProps, TaskData } from '../types';
import styles from './InputForm.module.css';

const InputForm: React.FC<InputFormProps> = ({ onAddTask, onClear }) => {
    const [projectName, setProjectName] = useState<string>('');
    const [task, setTask] = useState<string>('');
    const [humanTime, setHumanTime] = useState<string>('');
    const [aiTime, setAiTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');

        if (projectName && task && humanTime && aiTime) {
            const hTime = parseInt(humanTime);
            const aTime = parseInt(aiTime);

            if (hTime < 0 || aTime < 0) {
                setError("Time values cannot be negative");
                return;
            }


            // Convert task name to sentence case (capitalize first letter, lowercase rest)
            const formattedTask = task.charAt(0).toUpperCase() + task.slice(1).toLowerCase();

            const newTask: TaskData = {
                projectName,
                task: formattedTask,
                humanTime: hTime,
                aiTime: aTime,
            };

            onAddTask(newTask);
            setProjectName('');
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
                    <input
                        type="text"
                        placeholder="e.g. Website Redesign"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Activity</label>
                    <input
                        type="text"
                        placeholder="e.g. Create Mockups"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className={styles.input}
                        required
                    />
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
                <button type="submit" className={styles.button}>Add Task</button>
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
