export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
}