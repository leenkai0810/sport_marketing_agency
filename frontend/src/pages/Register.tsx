import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { registerSchema, RegisterData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            termsAccepted: false,
        },
    });

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            await authApi.register(data);
            toast.success(t('auth.register_success', 'Registration successful! Please login.'));
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || t('auth.register_failed', 'Registration failed');
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
                    <LanguageSwitcher isDark={false} />
                </div>
            </nav>

            {/* Background */}
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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">
                            {t('auth.createAccount', 'Create an Account')}
                        </h1>
                        <div className="w-12 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">
                            {t('auth.registerDesc', 'Join Global Media Sports to promote your talent.')}
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('user.name', 'Full Name')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('user.email', 'Email')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="john@example.com"
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
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
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="termsAccepted"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="border-zinc-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-gray-200 text-sm">
                                                        {t('auth.termsAccept', 'I accept the terms and privacy policy')}
                                                    </FormLabel>
                                                    <FormDescription className="text-gray-500 text-xs">
                                                        {t('auth.termsDesc1', 'You agree to our')}{' '}
                                                        <Link to="/terms" className="text-red-500 hover:text-red-400 underline">{t('nav.terms', 'Terms of Service')}</Link>
                                                        {' '}{t('auth.termsDesc2', 'and')}{' '}
                                                        <Link to="/privacy" className="text-red-500 hover:text-red-400 underline">{t('nav.privacy', 'Privacy Policy')}</Link>.
                                                    </FormDescription>
                                                    <FormMessage className="text-red-400" />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 mt-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? t('auth.creatingAccount', 'Creating account...') : t('auth.registerBtn', 'Register')}
                                    </Button>
                                </form>
                            </Form>
                            <div className="mt-6 text-center text-sm text-gray-400">
                                {t('auth.alreadyAccount', 'Already have an account?')}{' '}
                                <Link to="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                                    {t('auth.loginHere', 'Login here')}
                                </Link>
                            </div>
                        </div>
                    </div>

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

export default Register;
