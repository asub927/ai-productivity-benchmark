import React, { useState } from 'react';
import { TaskData } from '../types';
import { useProjects } from '../context/ProjectContext';
import Header from '../components/Header';
import InputForm from '../components/InputForm';
import Chart from '../components/Chart';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard: React.FC = () => {
    const { chartData, addChartData, deleteChartData, clearChartData } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddTask = (newTask: TaskData): void => {
        addChartData(newTask);
    };

    const handleDeleteTask = (index: number): void => {
        deleteChartData(index);
    };

    const handleClearClick = (): void => {
        setIsModalOpen(true);
    };

    const handleConfirmClear = (): void => {
        clearChartData();
        setIsModalOpen(false);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Header data={chartData} />
            <InputForm onAddTask={handleAddTask} onClear={handleClearClick} />
            <Chart data={chartData} onDeleteTask={handleDeleteTask} />
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
