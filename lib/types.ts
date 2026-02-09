/**
TypeScript type definitions matching backend API.
*/

export interface User {
    id: string;
    username: string;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
    username: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}

export interface TasksResponse {
    tasks: Task[];
    count: number;
}

export interface TaskResponse {
    task: Task;
}

export interface ErrorResponse {
    error: string;
    message: string;
    details?: string;
}

export interface StoredAuth {
    access_token: string;
    refresh_token: string;
    user_id: string;
    username: string;
}
