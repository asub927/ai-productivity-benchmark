import React, { useState } from 'react';
import { TaskData } from './types';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Chart from './components/Chart';
import ConfirmationModal from './components/ConfirmationModal';

// Initial data from the reference image
const INITIAL_DATA: TaskData[] = [
    { task: 'Writing', humanTime: 80, aiTime: 25 },
    { task: 'Active Learning', humanTime: 76, aiTime: 26 },
    { task: 'Critical Thinking', humanTime: 102, aiTime: 27 },
    { task: 'Troubleshooting', humanTime: 115, aiTime: 28 },
    { task: 'Management of Material Resources', humanTime: 92, aiTime: 28 },
    { task: 'Judgement and Decision Making', humanTime: 79, aiTime: 28 },
    { task: 'Time Management', humanTime: 77, aiTime: 29 },
    { task: 'Mathematics', humanTime: 108, aiTime: 29 },
    { task: 'Complex Problem Solving', humanTime: 122, aiTime: 30 },
    { task: 'Instructing', humanTime: 93, aiTime: 31 },
    { task: 'System Analysis', humanTime: 87, aiTime: 31 },
    { task: 'Operations Analysis', humanTime: 98, aiTime: 31 },
    { task: 'Management of Personnel', humanTime: 103, aiTime: 32 },
    { task: 'Programming', humanTime: 129, aiTime: 33 },
    { task: 'Quality Control Analysis', humanTime: 103, aiTime: 36 },
    { task: 'Management of Finances', humanTime: 106, aiTime: 38 },
    { task: 'Technology Design', humanTime: 142, aiTime: 39 },
];

const App: React.FC = () => {
    const [data, setData] = useState<TaskData[]>(INITIAL_DATA);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddTask = (newTask: TaskData): void => {
        setData([...data, newTask]);
    };

    const handleClearClick = (): void => {
        setIsModalOpen(true);
    };

    const handleConfirmClear = (): void => {
        setData([]);
        setIsModalOpen(false);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };

    return (
        <div className="app-container" style={{ padding: '2rem' }}>
            <Header />
            <InputForm onAddTask={handleAddTask} onClear={handleClearClick} />
            <Chart data={data} />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmClear}
                message="Are you sure you want to clear all tasks?"
            />
        </div>
    );
}

export default App;
