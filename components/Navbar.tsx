'use client';

/**
Navigation bar component.
Displays app title, username, and logout button.
*/
import { getCurrentUser } from '@/lib/auth';

interface NavbarProps {
    username: string;
    onLogout: () => void;
}

export default function Navbar({ username, onLogout }: NavbarProps) {
    return (
        <nav style={{
            backgroundColor: '#343a40',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{
                color: 'white',
                fontSize: '24px',
                margin: 0,
                fontWeight: 'bold'
            }}>
                Todo App
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ color: 'white', fontSize: '16px' }}>
                    Welcome, {username}!
                </span>
                <button
                    onClick={onLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
