import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, TaskData } from '../types';

interface ProjectContextType {
    projects: Project[];
    chartData: TaskData[];
    addProject: (name: string, initialTask: string) => void;
    deleteProject: (id: string) => void;
    addTaskToProject: (projectId: string, taskName: string) => void;
    deleteTaskFromProject: (projectId: string, taskName: string) => void;
    addChartData: (data: TaskData) => void;
    deleteChartData: (index: number) => void;
    clearChartData: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
};

interface ProjectProviderProps {
    children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(() => {
        const savedProjects = localStorage.getItem('projects');
        return savedProjects ? JSON.parse(savedProjects) : [];
    });

    const [chartData, setChartData] = useState<TaskData[]>(() => {
        const savedData = localStorage.getItem('chartData');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    useEffect(() => {
        localStorage.setItem('chartData', JSON.stringify(chartData));
    }, [chartData]);

    const addProject = (name: string, initialTask: string) => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            tasks: [initialTask]
        };
        setProjects([...projects, newProject]);
    };

    const deleteProject = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    const addTaskToProject = (projectId: string, taskName: string) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                // Prevent duplicate tasks
                if (p.tasks.includes(taskName)) return p;
                return { ...p, tasks: [...p.tasks, taskName] };
            }
            return p;
        }));
    };

    const deleteTaskFromProject = (projectId: string, taskName: string) => {
        setProjects(projects.map(p => {
            if (p.id === projectId) {
                return { ...p, tasks: p.tasks.filter(t => t !== taskName) };
            }
            return p;
        }));
    };

    const addChartData = (data: TaskData) => {
        setChartData([...chartData, data]);
    };

    const deleteChartData = (index: number) => {
        setChartData(chartData.filter((_, i) => i !== index));
    };

    const clearChartData = () => {
        setChartData([]);
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            chartData,
            addProject,
            deleteProject,
            addTaskToProject,
            deleteTaskFromProject,
            addChartData,
            deleteChartData,
            clearChartData
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
