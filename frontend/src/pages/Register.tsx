import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { registerSchema, RegisterData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage, FormDescription,
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import OtpModal, { hashOtp } from '@/components/OtpModal';
import emailjs from '@emailjs/browser';

const SPORTS = [
    { value: 'soccer', label: '⚽ Soccer / Football' },
    { value: 'basketball', label: '🏀 Basketball' },
    { value: 'tennis', label: '🎾 Tennis' },
    { value: 'swimming', label: '🏊 Swimming' },
    { value: 'track', label: '🏃 Track & Field' },
    { value: 'boxing', label: '🥊 Boxing / MMA' },
    { value: 'volleyball', label: '🏐 Volleyball' },
    { value: 'baseball', label: '⚾ Baseball' },
    { value: 'golf', label: '⛳ Golf' },
    { value: 'cycling', label: '🚴 Cycling' },
    { value: 'other', label: '🏅 Other' },
];

const sendOtp = async (email: string, name: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store HASHED OTP — raw code is never saved anywhere in the browser
    const hashed = await hashOtp(otp);
    sessionStorage.setItem('pendingOtpHash', hashed);
    sessionStorage.setItem('otpExpiry', (Date.now() + 10 * 60 * 1000).toString());
    await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { otp, to_email: email, name },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
};

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [pendingData, setPendingData] = useState<RegisterData | null>(null);

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '', password: '', name: '', phone: '',
            sport: '', instagram: '', tiktok: '', termsAccepted: false,
        },
    });

    // Step 1: validate form → send OTP → show modal
    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            await sendOtp(data.email, data.name);
            setPendingData(data);
            setShowOtp(true);
            toast.success(t('auth.verificationSent', 'Verification code sent to your email!'));
        } catch {
            toast.error(t('auth.otpSendFailed', 'Failed to send verification email. Please check your email address.'));
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: OTP verified → actually register
    const handleOtpVerified = async () => {
        if (!pendingData) return;
        setShowOtp(false);
        setIsLoading(true);
        try {
            await authApi.register(pendingData);
            toast.success(t('auth.register_success', 'Registration successful! Please login.'));
            navigate('/login');
        } catch (error: any) {
            const message = error.response?.data?.message || t('auth.register_failed', 'Registration failed');
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Populate the form with Google data
            form.setValue('email', user.email || '');
            form.setValue('name', user.displayName || '');

            // Set a dummy password since they are using Google
            // (The backend won't use this if we adjust it, but the schema requires it)
            form.setValue('password', 'google-auth-placeholder');
            setIsGoogleUser(true);

            toast.success(t('auth.googleDataLoaded', 'Google data loaded! Please complete the rest of the form.'));
        } catch (error: any) {
            console.error('Google register error:', error);
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

            <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15" style={{ backgroundImage: "url('/landing page.png')" }} />
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black opacity-90" />

            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black mb-2">{t('registration.athleteReg', 'Athlete Registration')}</h1>
                        <div className="w-16 h-1 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">{t('registration.athleteRegDesc', 'Fill out your information to get started with our professional services')}</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/95 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8">

                            {/* Google Register */}
                            <button
                                onClick={handleGoogleRegister}
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

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-zinc-800" />
                                <span className="text-zinc-600 text-xs font-medium uppercase tracking-wider">or register with email</span>
                                <div className="flex-1 h-px bg-zinc-800" />
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Row 1: Full Name + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.fullName', 'Full Name')} <span className="text-red-500">*</span></FormLabel>
                                                <FormControl><Input placeholder="John Doe" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.email', 'Email')} <span className="text-red-500">*</span></FormLabel>
                                                <FormControl><Input type="email" placeholder="john@example.com" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Row 2: Password + Primary Sport */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {!isGoogleUser && (
                                            <FormField control={form.control} name="password" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-200 text-sm font-medium">{t('user.password', 'Password')} <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl><Input type="password" placeholder="••••••••" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                                    <FormMessage className="text-red-400 text-xs" />
                                                </FormItem>
                                            )} />
                                        )}
                                        <FormField control={form.control} name="sport" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.sport', 'Primary Sport')} <span className="text-red-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-11">
                                                            <SelectValue placeholder={t('registration.selectSport', 'Select your sport')} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                                        {SPORTS.map(s => (
                                                            <SelectItem key={s.value} value={s.value} className="text-white hover:bg-zinc-700 hover:text-white focus:bg-zinc-700 focus:text-white data-[highlighted]:bg-zinc-700 data-[highlighted]:text-white">{s.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Row 3: Phone + Instagram */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.phone', 'Phone Number')} <span className="text-red-500">*</span></FormLabel>
                                                <FormControl><Input type="tel" placeholder="+1 (555) 000-0000" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="instagram" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.instagram', 'Instagram Handle')} <span className="text-red-500">*</span></FormLabel>
                                                <FormControl><Input placeholder="@yourhandle" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Row 4: TikTok */}
                                    <FormField control={form.control} name="tiktok" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200 text-sm font-medium">{t('registration.tiktok', 'TikTok Handle')} <span className="text-red-500">*</span></FormLabel>
                                            <FormControl><Input placeholder="@yourhandle" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11" {...field} /></FormControl>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )} />

                                    {/* Row 5: Terms */}
                                    <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-zinc-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 mt-0.5" />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-gray-200 text-sm cursor-pointer">{t('auth.termsAccept', 'I accept the terms and privacy policy')}</FormLabel>
                                                <FormDescription className="text-gray-500 text-xs">
                                                    {t('auth.termsDesc1', 'You agree to our')}{' '}
                                                    <Link to="/terms" className="text-red-500 hover:text-red-400 underline">{t('nav.terms', 'Terms of Service')}</Link>
                                                    {' '}{t('auth.termsDesc2', 'and')}{' '}
                                                    <Link to="/privacy" className="text-red-500 hover:text-red-400 underline">{t('nav.privacy', 'Privacy Policy')}</Link>.
                                                </FormDescription>
                                                <FormMessage className="text-red-400 text-xs" />
                                            </div>
                                        </FormItem>
                                    )} />

                                    <Button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-6 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending verification...' : t('registration.register', 'Register Now')}
                                    </Button>

                                    <p className="text-center text-sm text-gray-400">
                                        {t('auth.alreadyAccount', 'Already have an account?')}{' '}
                                        <Link to="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">{t('auth.loginHere', 'Login here')}</Link>
                                    </p>
                                </form>
                            </Form>
                        </div>
                    </div>
                </motion.div>
            </div>

            <OtpModal
                isOpen={showOtp}
                email={form.getValues('email')}
                onVerified={handleOtpVerified}
                onClose={() => setShowOtp(false)}
                onResend={() => sendOtp(form.getValues('email'), form.getValues('name'))}
            />
        </div>
    );
};

export default Register;
