import client from './client';
import { RegisterData, LoginData, AuthResponse } from '../types/auth'; // We'll need to define these types

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    googleLogin: async (idToken: string): Promise<AuthResponse> => {
        const response = await client.post<AuthResponse>('/api/auth/google', { idToken });
        return response.data;
    },

    sendOtp: async (email: string, name: string): Promise<{ message: string }> => {
        const response = await client.post('/api/auth/send-otp', { email, name });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string): Promise<{ verified: boolean; message: string }> => {
        const response = await client.post('/api/auth/verify-otp', { email, otp });
        return response.data;
    },

    requestResetToken: async (email: string): Promise<{ resetToken: string }> => {
        const response = await client.post('/api/auth/request-reset-token', { email });
        return response.data;
    },

    resetPassword: async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
        const response = await client.post('/api/auth/reset-password', { resetToken, newPassword });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },
};
