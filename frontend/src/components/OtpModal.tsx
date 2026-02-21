import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OtpModalProps {
    isOpen: boolean;
    email: string;
    onVerified: () => void;
    onClose: () => void;
    onResend: () => void;
}

// Simple hash function — NOT crypto-grade, but prevents casual console snooping
async function hashOtp(otp: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(otp + '_gms_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, email, onVerified, onClose, onResend }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        setOtp(['', '', '', '', '', '']);
        setError('');
        setCountdown(60);
        setCanResend(false);
        setIsVerifying(false);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (countdown <= 0) { setCanResend(true); return; }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, isOpen]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) newOtp[i] = text[i] || '';
        setOtp(newOtp);
        inputRefs.current[Math.min(text.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const code = otp.join('');
        const storedHash = sessionStorage.getItem('pendingOtpHash');
        const expiry = sessionStorage.getItem('otpExpiry');

        if (!storedHash || !expiry || Date.now() > parseInt(expiry)) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        setIsVerifying(true);
        const inputHash = await hashOtp(code);

        if (inputHash === storedHash) {
            sessionStorage.removeItem('pendingOtpHash');
            sessionStorage.removeItem('otpExpiry');
            onVerified();
        } else {
            setError('Incorrect OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
        setIsVerifying(false);
    };

    const handleResend = () => {
        setCanResend(false);
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
        onResend();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                <motion.div
                    className="relative w-full max-w-sm"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/50 to-zinc-700/20 rounded-2xl" />
                    <div className="relative bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
                        <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center mx-auto mb-5">
                            <span className="text-2xl">✉️</span>
                        </div>
                        <h2 className="text-xl font-black text-center text-white mb-1">Verify your email</h2>
                        <p className="text-sm text-gray-400 text-center mb-6">
                            We sent a 6-digit code to<br />
                            <span className="text-white font-medium">{email}</span>
                        </p>
                        <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputRefs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className={`w-11 h-13 text-center text-xl font-black bg-zinc-800 border rounded-xl text-white transition-all duration-200 outline-none
                                        ${error ? 'border-red-500' : digit ? 'border-red-600' : 'border-zinc-700'}
                                        focus:border-red-500 focus:ring-2 focus:ring-red-600/20`}
                                    style={{ height: '52px' }}
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
                        <Button
                            onClick={handleVerify}
                            disabled={otp.join('').length !== 6 || isVerifying}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-wider uppercase py-5 mb-4 disabled:opacity-40"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Code'}
                        </Button>
                        <div className="text-center text-sm text-gray-500">
                            {canResend ? (
                                <button onClick={handleResend} className="text-red-500 hover:text-red-400 font-medium transition-colors">
                                    Resend OTP
                                </button>
                            ) : (
                                <>Resend in <span className="text-white font-medium">{countdown}s</span></>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Export the hash function so Register/ForgotPassword can use it
export { hashOtp };
export default OtpModal;
