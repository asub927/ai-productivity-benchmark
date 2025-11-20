import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types';

interface ProjectContextType {
    projects: Project[];
    addProject: (name: string) => void;
    deleteProject: (id: string) => void;
    addTaskToProject: (projectId: string, taskName: string) => void;
    deleteTaskFromProject: (projectId: string, taskName: string) => void;
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

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const addProject = (name: string) => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            tasks: []
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

    return (
        <ProjectContext.Provider value={{ projects, addProject, deleteProject, addTaskToProject, deleteTaskFromProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
