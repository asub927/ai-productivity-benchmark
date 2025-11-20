/**
 * Represents a task with time comparisons between human and AI completion
 */
export interface TaskData {
    projectName: string;
    task: string;
    humanTime: number;
    aiTime: number;
}

/**
 * Props for the Chart component
 */
export interface ChartProps {
    data: TaskData[];
    onDeleteTask: (index: number) => void;
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

/**
 * Represents a project with associated tasks
 */
export interface Project {
    id: string;
    name: string;
    tasks: string[];
}
