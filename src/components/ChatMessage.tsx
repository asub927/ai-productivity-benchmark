import React from 'react';

interface ChatMessageProps {
    message: {
        role: 'user' | 'model';
        text: string;
    };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '12px',
        }}>
            <div style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: isUser ? '#2563eb' : '#f3f4f6',
                color: isUser ? 'white' : '#1f2937',
                borderBottomRightRadius: isUser ? '4px' : '12px',
                borderBottomLeftRadius: isUser ? '12px' : '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                fontSize: '14px',
                lineHeight: '1.5',
            }}>
                {message.text}
            </div>
        </div>
    );
};

export default ChatMessage;
