import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectsPage.module.css';

const ProjectsPage: React.FC = () => {
    const { projects, addProject, deleteProject, addTaskToProject, deleteTaskFromProject } = useProjects();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const [newTaskNames, setNewTaskNames] = useState<{ [key: string]: string }>({});

    const handleAddProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            addProject(newProjectName.trim());
            setNewProjectName('');
            setIsCreating(false);
        }
    };

    const handleAddTask = (e: React.FormEvent, projectId: string) => {
        e.preventDefault();
        const taskName = newTaskNames[projectId];
        if (taskName && taskName.trim()) {
            addTaskToProject(projectId, taskName.trim());
            setNewTaskNames({ ...newTaskNames, [projectId]: '' });
        }
    };

    const handleTaskInputChange = (projectId: string, value: string) => {
        setNewTaskNames({ ...newTaskNames, [projectId]: value });
    };

    const toggleExpand = (projectId: string) => {
        setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Projects & Tasks</h2>
                    <p className={styles.description}>Manage your projects and their associated tasks.</p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate('/')}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        className={styles.createButton}
                        onClick={() => setIsCreating(!isCreating)}
                    >
                        {isCreating ? 'Cancel' : 'Create New Project'}
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className={styles.createSection}>
                    <form onSubmit={handleAddProject} className={styles.createForm}>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className={styles.input}
                            autoFocus
                        />
                        <button type="submit" className={styles.saveButton} disabled={!newProjectName.trim()}>
                            Save Project
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Project Name</th>
                            <th className={styles.th}>Tasks</th>
                            <th className={styles.th} style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={styles.emptyState}>
                                    No projects found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            projects.map(project => (
                                <React.Fragment key={project.id}>
                                    <tr className={`${styles.tr} ${expandedProjectId === project.id ? styles.trExpanded : ''}`}>
                                        <td className={styles.td}>
                                            <span className={styles.projectName}>{project.name}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.taskCount}>{project.tasks.length} tasks</span>
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.manageButton}
                                                    onClick={() => toggleExpand(project.id)}
                                                >
                                                    {expandedProjectId === project.id ? 'Collapse' : 'Manage Tasks'}
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                    aria-label="Delete Project"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedProjectId === project.id && (
                                        <tr className={styles.expandedRow}>
                                            <td colSpan={3} className={styles.expandedCell}>
                                                <div className={styles.tasksContainer}>
                                                    <h4 className={styles.tasksTitle}>Tasks for {project.name}</h4>
                                                    <ul className={styles.taskList}>
                                                        {project.tasks.map((task, index) => (
                                                            <li key={`${project.id}-${index}`} className={styles.taskItem}>
                                                                <span>{task}</span>
                                                                <button
                                                                    onClick={() => deleteTaskFromProject(project.id, task)}
                                                                    className={styles.deleteTaskButton}
                                                                    aria-label="Delete Task"
                                                                >
                                                                    ×
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <form onSubmit={(e) => handleAddTask(e, project.id)} className={styles.addTaskForm}>
                                                        <input
                                                            type="text"
                                                            placeholder="Add new task..."
                                                            value={newTaskNames[project.id] || ''}
                                                            onChange={(e) => handleTaskInputChange(project.id, e.target.value)}
                                                            className={styles.taskInput}
                                                        />
                                                        <button
                                                            type="submit"
                                                            className={styles.addTaskButton}
                                                            disabled={!newTaskNames[project.id]?.trim()}
                                                        >
                                                            Add Task
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsPage;
