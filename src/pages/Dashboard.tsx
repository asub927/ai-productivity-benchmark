import React, { useState } from 'react';
import { TaskData } from '../types';
import Header from '../components/Header';
import InputForm from '../components/InputForm';
import Chart from '../components/Chart';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<TaskData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddTask = (newTask: TaskData): void => {
        setData([...data, newTask]);
    };

    const handleDeleteTask = (index: number): void => {
        setData(data.filter((_, i) => i !== index));
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
        <>
            <Header data={data} />
            <InputForm onAddTask={handleAddTask} onClear={handleClearClick} />
            <Chart data={data} onDeleteTask={handleDeleteTask} />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmClear}
                message="Are you sure you want to clear all tasks?"
            />
        </>
    );
}

export default Dashboard;
