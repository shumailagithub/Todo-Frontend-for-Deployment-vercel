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
        <nav className="bg-slate-800 p-4 flex justify-between items-center shadow-md">
            <h1 className="text-white text-xl font-bold">
                TaskFlow
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-white text-sm">
                    Welcome, {username}!
                </span>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
