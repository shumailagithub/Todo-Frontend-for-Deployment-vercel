'use client';

/**
Task list container component.
Renders TaskItem components for each task.
*/
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onToggle: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
    return (
        <div>
            {tasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                    No tasks yet
                </div>
            )}

            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                />
            ))}
        </div>
    );
}
