'use client';

/**
Individual task display component.
Shows task title, description, toggle checkbox, and delete button.
*/
import { Task } from '@/lib/types';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <div className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 flex items-center justify-between ${task.completed ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}`}>
            <div className="flex items-start flex-1">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggle}
                    className="mr-3 mt-1 cursor-pointer w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                    </div>
                    {task.description && (
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {task.description}
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
                Delete
            </button>
        </div>
    );
}
