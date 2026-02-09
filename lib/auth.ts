/**
Authentication state management utilities.
*/
import { StoredAuth } from './types';

export function isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token && isTokenValid(token);
}

export function getAuth(): StoredAuth | null {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (!access_token || !refresh_token || !user_id || !username) {
        return null;
    }

    return {
        access_token: access_token!,
        refresh_token: refresh_token!,
        user_id: user_id!,
        username: username!,
    };
}

export function setAuth(auth: StoredAuth): void {
    localStorage.setItem('access_token', auth.access_token);
    localStorage.setItem('refresh_token', auth.refresh_token);
    localStorage.setItem('user_id', auth.user_id);
    localStorage.setItem('username', auth.username);
}

export function clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
}

export function isTokenValid(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch {
        return false;
    }
}

export function getCurrentUser(): { user_id: string; username: string } | null {
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (!user_id || !username) {
        return null;
    }

    return {
        user_id: user_id!,
        username: username!,
    };
}
