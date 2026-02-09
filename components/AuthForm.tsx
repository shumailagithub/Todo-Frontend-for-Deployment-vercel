'use client';

/**
Reusable authentication form for login and registration.
*/
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { register, login } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import styles from './AuthForm.module.css';

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

                router.push('/dashboard');
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

                router.push('/dashboard');
            }
        } catch (err: any) {
            setError((err as Error).message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authForm}>
            <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                {mode === 'register' && (
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
                </button>
            </form>
        </div>
    );
}
