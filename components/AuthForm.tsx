'use client';

/**
Reusable authentication form for login and registration.
*/
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { register, login } from '@/lib/api';
import { setAuth } from '@/lib/auth';

interface AuthFormProps {
    mode: 'login' | 'register';
    onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'register') {
                // Client-side validation for registration
                if (!username || username.length < 3 || username.length > 50) {
                    setError('Username must be 3-50 characters (alphanumeric and underscores only)');
                    setLoading(false);
                    return;
                }

                const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
                if (!usernameRegex.test(username)) {
                    setError('Username can only contain letters, numbers, and underscores');
                    setLoading(false);
                    return;
                }

                if (!password || password.length < 8) {
                    setError('Password must be at least 8 characters');
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                // Register user
                const authResponse = await register(username, password);
                setAuth({
                    access_token: authResponse.access_token,
                    refresh_token: authResponse.refresh_token,
                    user_id: authResponse.user_id,
                    username: authResponse.username,
                });

                if (onSuccess) onSuccess();
            } else {
                // Login user
                if (!username || !password) {
                    setError('Username and password are required');
                    setLoading(false);
                    return;
                }

                const authResponse = await login(username, password);
                setAuth({
                    access_token: authResponse.access_token,
                    refresh_token: authResponse.refresh_token,
                    user_id: authResponse.user_id,
                    username: authResponse.username,
                });

                if (onSuccess) onSuccess();
            }
        } catch (err: any) {
            setError((err as Error).message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
            
            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter username"
                    />
                </div>
                
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>
                
                {mode === 'register' && (
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        mode === 'login' ? 'Sign In' : 'Sign Up'
                    )}
                </button>
            </form>
        </div>
    );
}
