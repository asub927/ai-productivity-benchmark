import { useState, useCallback } from 'react';
import { generateResponse } from '../services/gemini';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMessage: Message = { role: 'user', text };
        setMessages(prev => [...prev, userMessage]);

        try {
            // Call API with current history (excluding the new message as it's passed separately, 
            // but the service expects history. Actually the service takes history + new message.
            // Let's pass the *previous* messages as history.
            const responseText = await generateResponse(messages, text);

            const aiMessage: Message = { role: 'model', text: responseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            setError('Failed to send message');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const addMessage = useCallback((message: Message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        addMessage
    };
};
