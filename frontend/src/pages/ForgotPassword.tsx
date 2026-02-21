import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/api/auth';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import OtpModal, { hashOtp } from '@/components/OtpModal';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

type Step = 'email' | 'otp' | 'newpassword';

const sendOtp = async (email: string, name: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store HASHED OTP — never the raw code
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);
        try {
            await sendOtp(email, email.split('@')[0]);
            setShowOtp(true);
            // SECURITY: Generic message — never reveal if email exists
            toast.success(t('auth.otpSent', 'If an account exists with this email, a code has been sent.'));
        } catch {
            toast.error(t('auth.otpSendFailed', 'Failed to send verification code. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerified = async () => {
        setShowOtp(false);
        setIsLoading(true);
        try {
            // Get signed reset token from backend
            const { resetToken: token } = await authApi.requestResetToken(email);
            setResetToken(token);
            setStep('newpassword');
            toast.success(t('auth.emailVerified', 'Email verified! Set your new password.'));
        } catch {
            toast.error(t('auth.somethingWrong', 'Something went wrong. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('auth.passwordsNoMatch', 'Passwords do not match'));
            return;
        }
        if (newPassword.length < 6) {
            toast.error(t('auth.passwordMinLength', 'Password must be at least 6 characters'));
            return;
        }
        setIsLoading(true);
        try {
            await authApi.resetPassword(resetToken, newPassword);
            toast.success(t('auth.passwordResetSuccess', 'Password reset successfully! Please login.'));
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('auth.resetFailed', 'Failed to reset password'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
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

            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">Reset Password</h1>
                        <div className="w-12 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">
                            {step === 'email'
                                ? 'Enter your email to receive a verification code'
                                : 'Create your new password'}
                        </p>
                    </div>

                    {/* Steps indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {(['email', 'otp', 'newpassword'] as Step[]).map((s, i) => (
                            <React.Fragment key={s}>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'border-red-600 bg-red-600 text-white' :
                                    (step === 'newpassword' && i < 2) || (step === 'otp' && i < 1)
                                        ? 'border-red-600 bg-red-600/20 text-red-500'
                                        : 'border-zinc-700 text-zinc-600'
                                    }`}>{i + 1}</div>
                                {i < 2 && <div className={`w-8 h-0.5 ${i < (['email', 'otp', 'newpassword'] as Step[]).indexOf(step) ? 'bg-red-600' : 'bg-zinc-800'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
                            {step === 'email' && (
                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-gray-200 text-sm font-medium">Email Address</label>
                                        <Input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-wider uppercase py-5"
                                    >
                                        {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                                    </Button>
                                </form>
                            )}

                            {step === 'newpassword' && (
                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-gray-200 text-sm font-medium">New Password</label>
                                        <Input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-200 text-sm font-medium">Confirm New Password</label>
                                        <Input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-600 h-11"
                                        />
                                    </div>
                                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-red-400 text-xs">Passwords do not match</p>
                                    )}
                                    <Button
                                        type="submit"
                                        disabled={isLoading || newPassword !== confirmPassword}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-wider uppercase py-5"
                                    >
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                </form>
                            )}

                            <p className="mt-6 text-center text-sm text-gray-500">
                                <Link to="/login" className="text-red-500 hover:text-red-400 transition-colors">← Back to Login</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <OtpModal
                isOpen={showOtp}
                email={email}
                onVerified={handleOtpVerified}
                onClose={() => setShowOtp(false)}
                onResend={() => sendOtp(email, email.split('@')[0])}
            />
        </div>
    );
};

export default ForgotPassword;
