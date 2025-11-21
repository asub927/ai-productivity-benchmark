import React from 'react';

interface ChatActionOptionsProps {
    onActionSelect: (action: 'create_project' | 'add_task' | 'fill_form') => void;
}

const ChatActionOptions: React.FC<ChatActionOptionsProps> = ({ onActionSelect }) => {
    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '12px' }}>
            <button
                onClick={() => onActionSelect('create_project')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid #2563eb',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                + New Project
            </button>
            <button
                onClick={() => onActionSelect('add_task')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid #2563eb',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                + Add Task
            </button>
            <button
                onClick={() => onActionSelect('fill_form')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid #2563eb',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                📝 Add to Dashboard
            </button>
        </div>
    );
};

export default ChatActionOptions;
