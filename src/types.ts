/**
 * Represents a task with time comparisons between human and AI completion
 */
export interface TaskData {
    task: string;
    humanTime: number;
    aiTime: number;
}

/**
 * Props for the Chart component
 */
export interface ChartProps {
    data: TaskData[];
}

/**
 * Props for the InputForm component
 */
export interface InputFormProps {
    onAddTask: (task: TaskData) => void;
    onClear: () => void;
}

/**
 * Props for the ConfirmationModal component
 */
export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}
