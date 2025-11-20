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
            <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={styles.input}
                required
            />
            <input
                type="text"
                placeholder="Activity Description"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className={styles.input}
                required
            />
            <input
                type="number"
                placeholder="Without AI (min)"
                value={humanTime}
                onChange={(e) => setHumanTime(e.target.value)}
                className={styles.input}
                min="0"
                required
            />
            <input
                type="number"
                placeholder="With AI (min)"
                value={aiTime}
                onChange={(e) => setAiTime(e.target.value)}
                className={styles.input}
                min="0"
                required
            />
            <button type="submit" className={styles.button}>Add Task</button>
            <button
                type="button"
                className={`${styles.button} ${styles.clearButton}`}
                onClick={onClear}
            >
                Clear All
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default InputForm;
