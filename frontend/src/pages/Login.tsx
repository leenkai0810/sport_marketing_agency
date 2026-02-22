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
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleLoginSuccess = (response: any) => {
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            toast.success(t('auth.login_success', 'Login successful!'));
            navigate(response.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        }
    };

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);
            handleLoginSuccess(response);
        } catch (error: any) {
            const message = error.response?.data?.message || t('auth.login_failed', 'Login failed');
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const response = await authApi.googleLogin(idToken);
            handleLoginSuccess(response);
        } catch (error: any) {
            console.error('Google login error:', error);
            toast.error(t('auth.googleFailed', 'Google sign-in failed. Please try again.'));
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-9 h-9 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-base font-bold">Global</span>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
                        </div>
                    </Link>
                    <LanguageSwitcher isDark={false} />
                </div>
            </nav>

            <div className="fixed inset-0 z-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/landing page.png')" }} />
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" style={{ opacity: 0.85 }} />

            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">{t('auth.welcomeBack', 'Welcome Back')}</h1>
                        <div className="w-12 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">{t('auth.loginDesc', 'Login to your Global Media Sports account.')}</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">

                            {/* Google Sign-In */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isGoogleLoading}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 mb-5 disabled:opacity-60"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {isGoogleLoading ? 'Signing in...' : t('auth.continueGoogle', 'Continue with Google')}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-px bg-zinc-800" />
                                <span className="text-zinc-600 text-xs font-medium uppercase tracking-wider">or</span>
                                <div className="flex-1 h-px bg-zinc-800" />
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('user.email', 'Email')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@example.com" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} />
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
                                                <div className="flex items-center justify-between mb-1">
                                                    <FormLabel className="text-gray-200 text-sm font-medium">{t('user.password', 'Password')}</FormLabel>
                                                    <Link to="/forgot-password" className="text-xs text-red-500 hover:text-red-400 transition-colors">
                                                        {t('auth.forgotPassword', 'Forgot password?')}
                                                    </Link>
                                                </div>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
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

                    <div className="mt-8 flex items-center justify-center gap-6">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all duration-300 group">
                            <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-zinc-800 transition-all duration-300 group">
                            <FaTiktok className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
