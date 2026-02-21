import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
    sport: z.string().min(1, 'Please select your primary sport'),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
});

export type RegisterData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'USER' | 'ADMIN';
    subscriptionStatus?: string;
    phone?: string | null;
    sport?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
}

export interface AuthResponse {
    token?: string;
    user?: User;
    message?: string;
    userId?: string;
}
