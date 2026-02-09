/**
API client functions with automatic token refresh.
*/
import { LoginRequest, RegisterRequest, CreateTaskRequest, UpdateTaskRequest, TasksResponse, TaskResponse, ErrorResponse, AuthResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
Helper function to fetch from backend API with token handling.
*/
async function fetchAPI<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    if (!response.ok) {
        const error: ErrorResponse = await response.json();
        const errorObj = new Error(error.message);
        (errorObj as any).details = error.details;
        throw errorObj;
    }

    return response.json();
}

/**
Helper function to check if token is expiring soon.
*/
function isTokenExpiringSoon(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const exp = payload.exp;
        const fiveMinutes = 5 * 60;

        return exp - now < fiveMinutes;
    } catch {
        return false;
    }
}

/**
Helper function to refresh access token.
*/
async function refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetchAPI<{ access_token: string; refresh_token: string }>('/api/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        // Store new tokens
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user_id', JSON.parse(atob(response.access_token.split('.')[1])).sub);
    } catch (error) {
        // Clear auth and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        window.location.href = '/login';
        throw error;
    }
}

/**
Enhanced fetchAPI with automatic token refresh.
*/
async function fetchAPIWithRefresh<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem('access_token');

    // Check if token is expiring soon
    if (token && isTokenExpiringSoon(token)) {
        await refreshAccessToken();
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    });

    // Handle 401 errors with token refresh
    if (response.status === 401) {
        await refreshAccessToken();
        // Retry original request with new token
        const newToken = localStorage.getItem('access_token');
        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newToken}`,
            },
        });

        if (!retryResponse.ok) {
            const error: ErrorResponse = await retryResponse.json();
            const errorObj = new Error(error.message);
            (errorObj as any).details = error.details;
            throw errorObj;
        }

        return retryResponse.json();
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    if (!response.ok) {
        const error: ErrorResponse = await response.json();
        const errorObj = new Error(error.message);
        (errorObj as any).details = error.details;
        throw errorObj;
    }

    return response.json();
}

// Auth API functions
export async function register(username: string, password: string): Promise<AuthResponse> {
    const request: RegisterRequest = { username, password };
    return fetchAPIWithRefresh<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { username, password };
    return fetchAPIWithRefresh<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    return fetchAPI<{ access_token: string; refresh_token: string }>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
}

export async function logout(refreshToken: string): Promise<void> {
    return fetchAPIWithRefresh<void>('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
}

// Task API functions
export async function getTasks(filter?: { completed?: boolean }): Promise<TasksResponse> {
    const params = new URLSearchParams();
    if (filter?.completed !== undefined) {
        params.append('completed', filter.completed.toString());
    }
    const endpoint = params.toString() ? `/api/tasks?${params}` : '/api/tasks';
    return fetchAPIWithRefresh<TasksResponse>(endpoint);
}

export async function getTask(taskId: string): Promise<TaskResponse> {
    return fetchAPIWithRefresh<TaskResponse>(`/api/tasks/${taskId}`);
}

export async function createTask(title: string, description?: string): Promise<TaskResponse> {
    const request: CreateTaskRequest = { title, description };
    return fetchAPIWithRefresh<TaskResponse>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function updateTask(taskId: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    return fetchAPIWithRefresh<TaskResponse>(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function toggleTask(taskId: string): Promise<TaskResponse> {
    return fetchAPIWithRefresh<TaskResponse>(`/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
    });
}

export async function deleteTask(taskId: string): Promise<void> {
    return fetchAPIWithRefresh<void>(`/api/tasks/${taskId}`, {
        method: 'DELETE',
    });
}
