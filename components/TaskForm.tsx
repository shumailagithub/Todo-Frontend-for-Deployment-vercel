'use client';

/**
Add task form component.
Provides title input and optional description textarea.
*/
import { useState, FormEvent } from 'react';

interface TaskFormProps {
    onSubmit: (title: string, description?: string) => void;
    loading?: boolean;
}

export default function TaskForm({ onSubmit, loading = false }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        onSubmit(title.trim(), description.trim() || undefined);

        // Clear form
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-2 font-bold text-slate-700 dark:text-slate-300">
                    Title:
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    required
                    maxLength={200}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>
            <div>
                <label className="block mb-2 font-bold text-slate-700 dark:text-slate-300">
                    Description (optional):
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    maxLength={1000}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                />
            </div>
            <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}
