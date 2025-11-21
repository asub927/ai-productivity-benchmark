import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatActionOptions from './ChatActionOptions';
import { useChat } from '../hooks/useChat';
import { useProjects } from '../context/ProjectContext';

interface ChatWindowProps {
    onClose: () => void;
}

type ChatMode = 'chat' | 'create_project_name' | 'create_project_task' | 'add_task_select_project' | 'add_task_name' | 'fill_form_select_project' | 'fill_form_select_task' | 'fill_form_human_time' | 'fill_form_ai_time';

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const { messages, sendMessage: sendChatMessage, isLoading, addMessage } = useChat();
    const { projects, addProject, addTaskToProject, addChartData } = useProjects();
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState<ChatMode>('chat');
    const [tempData, setTempData] = useState<any>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, mode]);

    const handleActionSelect = (action: 'create_project' | 'add_task' | 'fill_form') => {
        if (action === 'create_project') {
            setMode('create_project_name');
            addMessage({ role: 'model', text: 'Great! What should we name the new project?' });
        } else if (action === 'add_task') {
            if (projects.length === 0) {
                addMessage({ role: 'model', text: 'You don\'t have any projects yet. Create one first!' });
                return;
            }
            setMode('add_task_select_project');
            const projectList = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
            addMessage({ role: 'model', text: `Which project would you like to add a task to? (Type the number)\n${projectList}` });
        } else if (action === 'fill_form') {
            if (projects.length === 0) {
                addMessage({ role: 'model', text: 'You don\'t have any projects yet. Create one first!' });
                return;
            }
            setMode('fill_form_select_project');
            const projectList = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
            addMessage({ role: 'model', text: `Let's fill out the form. First, select a project: (Type the number)\n${projectList}` });
        }
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const text = inputValue.trim();
        setInputValue('');

        // Add user message visually
        addMessage({ role: 'user', text });

        if (mode === 'chat') {
            sendChatMessage(text);
        } else if (mode === 'create_project_name') {
            setTempData({ ...tempData, projectName: text });
            setMode('create_project_task');
            setTimeout(() => addMessage({ role: 'model', text: 'Got it. What is the first task for this project?' }), 500);
        } else if (mode === 'create_project_task') {
            addProject(tempData.projectName, text);
            setMode('chat');
            setTempData({});
            setTimeout(() => addMessage({ role: 'model', text: `Project "${tempData.projectName}" created with task "${text}"!` }), 500);
        } else if (mode === 'add_task_select_project') {
            const index = parseInt(text) - 1;
            if (isNaN(index) || index < 0 || index >= projects.length) {
                setTimeout(() => addMessage({ role: 'model', text: 'Invalid selection. Please type the number of the project.' }), 500);
                return;
            }
            setTempData({ ...tempData, selectedProjectId: projects[index].id, selectedProjectName: projects[index].name });
            setMode('add_task_name');
            setTimeout(() => addMessage({ role: 'model', text: `Okay, adding to "${projects[index].name}". What is the task name?` }), 500);
        } else if (mode === 'add_task_name') {
            addTaskToProject(tempData.selectedProjectId, text);
            setMode('chat');
            setTempData({});
            setTimeout(() => addMessage({ role: 'model', text: `Task "${text}" added to project "${tempData.selectedProjectName}"!` }), 500);
        } else if (mode === 'fill_form_select_project') {
            const index = parseInt(text) - 1;
            if (isNaN(index) || index < 0 || index >= projects.length) {
                setTimeout(() => addMessage({ role: 'model', text: 'Invalid selection. Please type the number of the project.' }), 500);
                return;
            }
            const selectedProject = projects[index];
            setTempData({ ...tempData, selectedProjectId: selectedProject.id, selectedProjectName: selectedProject.name, projectTasks: selectedProject.tasks });

            if (selectedProject.tasks.length === 0) {
                setTimeout(() => addMessage({ role: 'model', text: 'This project has no tasks. Please add a task first.' }), 500);
                setMode('chat');
                return;
            }

            setMode('fill_form_select_task');
            const taskList = selectedProject.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
            setTimeout(() => addMessage({ role: 'model', text: `Great. Select a task from "${selectedProject.name}": (Type the number)\n${taskList}` }), 500);
        } else if (mode === 'fill_form_select_task') {
            const index = parseInt(text) - 1;
            if (isNaN(index) || index < 0 || index >= tempData.projectTasks.length) {
                setTimeout(() => addMessage({ role: 'model', text: 'Invalid selection. Please type the number of the task.' }), 500);
                return;
            }
            const selectedTask = tempData.projectTasks[index];
            setTempData({ ...tempData, taskName: selectedTask });
            setMode('fill_form_human_time');
            setTimeout(() => addMessage({ role: 'model', text: `Selected "${selectedTask}". How many minutes did it take the Human?` }), 500);
        } else if (mode === 'fill_form_human_time') {
            if (isNaN(parseInt(text))) {
                setTimeout(() => addMessage({ role: 'model', text: 'Please enter a valid number for minutes.' }), 500);
                return;
            }
            setTempData({ ...tempData, humanTime: text });
            setMode('fill_form_ai_time');
            setTimeout(() => addMessage({ role: 'model', text: 'And how many minutes for Human + AI?' }), 500);
        } else if (mode === 'fill_form_ai_time') {
            if (isNaN(parseInt(text))) {
                setTimeout(() => addMessage({ role: 'model', text: 'Please enter a valid number for minutes.' }), 500);
                return;
            }

            addChartData({
                projectName: tempData.selectedProjectName,
                task: tempData.taskName,
                humanTime: parseInt(tempData.humanTime),
                aiTime: parseInt(text)
            });

            setMode('chat');
            setTempData({});
            setTimeout(() => addMessage({ role: 'model', text: 'Task added to the dashboard!' }), 500);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                backgroundColor: '#1e293b',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e'
                    }} />
                    <span style={{ fontWeight: 600 }}>AI Assistant</span>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '4px',
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
            }}>
                {messages.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        color: '#64748b',
                        marginTop: '20px',
                        fontSize: '14px',
                    }}>
                        <p>👋 Hi there! How can I help you today?</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                ))}

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            backgroundColor: '#f3f4f6',
                            borderBottomLeftRadius: '4px',
                            color: '#64748b',
                            fontSize: '12px',
                        }}>
                            Thinking...
                        </div>
                    </div>
                )}

                {mode === 'chat' && !isLoading && (
                    <ChatActionOptions onActionSelect={handleActionSelect} />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleInputSubmit} style={{
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '8px',
            }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={mode === 'chat' ? "Type a message..." : "Enter details..."}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        outline: 'none',
                        fontSize: '14px',
                    }}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: inputValue.trim() ? 'pointer' : 'default',
                        opacity: inputValue.trim() ? 1 : 0.5,
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
