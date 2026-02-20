import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { loginSchema, LoginData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);
            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                toast.success(t('auth.login_success', 'Login successful!'));
                if (response.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || t('auth.login_failed', 'Login failed');
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex flex-col items-center justify-center min-h-screen py-10 relative">
            <div className="absolute top-4 right-4 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
                <LanguageSwitcher isDark={true} />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('auth.welcomeBack', 'Welcome Back')}</CardTitle>
                    <CardDescription>
                        {t('auth.loginDesc', 'Login to your Global Media Sports account.')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.email', 'Email')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('user.password', 'Password')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? t('auth.loggingIn', 'Logging in...') : t('auth.loginBtn', 'Login')}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {t('auth.noAccount', "Don't have an account?")}{' '}
                        <Link to="/register" className="underline text-blue-600">
                            {t('auth.registerHere', 'Register here')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

