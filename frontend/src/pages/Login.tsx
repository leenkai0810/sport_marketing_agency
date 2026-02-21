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
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Nav bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-9 h-9 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-base font-bold">Global</span>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher isDark={false} />
                    </div>
                </div>
            </nav>

            {/* Background image */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: "url('/landing page.png')" }}
            />
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" style={{ opacity: 0.85 }} />

            {/* Content */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Logo + heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">
                            {t('auth.welcomeBack', 'Welcome Back')}
                        </h1>
                        <div className="w-12 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">
                            {t('auth.loginDesc', 'Login to your Global Media Sports account.')}
                        </p>
                    </div>

                    {/* Card */}
                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('user.email', 'Email')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="john@example.com"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600/20 h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('user.password', 'Password')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 focus:ring-red-600/20 h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 mt-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t('auth.loggingIn', 'Logging in...') : t('auth.loginBtn', 'Login')}
                                    </Button>
                                </form>
                            </Form>
                            <div className="mt-6 text-center text-sm text-gray-400">
                                {t('auth.noAccount', "Don't have an account?")}{' '}
                                <Link to="/register" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                                    {t('auth.registerHere', 'Register here')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Social links */}
                    <div className="mt-8 flex items-center justify-center gap-4 text-gray-500 text-xs">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">📸 Instagram</a>
                        <span>·</span>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">🎵 TikTok</a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
