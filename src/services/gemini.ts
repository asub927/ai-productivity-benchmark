import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client
// Note: In a real app, this should be in an environment variable
// For this demo, we'll check if the key exists, otherwise return a mock response
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResponse = async (history: { role: 'user' | 'model', text: string }[], newMessage: string) => {
    if (!API_KEY) {
        // Mock response if no key is provided
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "I'm a demo AI assistant! To make me real, please add a VITE_GEMINI_API_KEY to your .env file.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }],
            })),
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I encountered an error while trying to reach the AI service.";
    }
};
