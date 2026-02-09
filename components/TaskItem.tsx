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
        <div style={{
            border: '1px solid #e0e0e',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: task.completed ? '#f8f9fa' : 'white'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggle}
                    style={{
                        marginRight: '12px',
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px'
                    }}
                />
                <div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#6c757d' : '#212529'
                    }}>
                        {task.title}
                    </div>
                    {task.description && (
                        <div style={{
                            fontSize: '14px',
                            color: '#6c757d',
                            marginTop: '4px'
                        }}>
                            {task.description}
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={onDelete}
                style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
                >
                    Delete
                </button>
        </div>
    );
}
