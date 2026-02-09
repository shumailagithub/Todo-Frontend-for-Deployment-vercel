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
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
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
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Description (optional):
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    maxLength={1000}
                    placeholder="Add a description..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={loading || !title.trim()}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    opacity: loading || !title.trim() ? 0.5 : 1
                }}
            >
                {loading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}
