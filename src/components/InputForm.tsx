import React, { useState } from 'react';
import { InputFormProps, TaskData } from '../types';
import styles from './InputForm.module.css';

const InputForm: React.FC<InputFormProps> = ({ onAddTask, onClear }) => {
    const [task, setTask] = useState<string>('');
    const [humanTime, setHumanTime] = useState<string>('');
    const [aiTime, setAiTime] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setError('');

        if (task && humanTime && aiTime) {
            const hTime = parseInt(humanTime);
            const aTime = parseInt(aiTime);

            if (hTime < 0 || aTime < 0) {
                setError("Time values cannot be negative");
                return;
            }

            const newTask: TaskData = {
                task,
                humanTime: hTime,
                aiTime: aTime,
            };

            onAddTask(newTask);
            setTask('');
            setHumanTime('');
            setAiTime('');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task Name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className={styles.input}
                required
            />
            <input
                type="number"
                placeholder="Human Time (min)"
                value={humanTime}
                onChange={(e) => setHumanTime(e.target.value)}
                className={styles.input}
                min="0"
                required
            />
            <input
                type="number"
                placeholder="AI Time (min)"
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
