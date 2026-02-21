import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { subscriptionApi } from '@/api/subscription';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard');
      return;
    }

    const verify = async () => {
      try {
        await subscriptionApi.verifySession(sessionId);
      } catch (error) {
        console.error('Failed to verify session:', error);
        // Show success regardless — Stripe already confirmed payment
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/LOGO.png" alt="Global Media Sports" className="w-9 h-9 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold">Global</span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-20 pb-12">
        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {verifying ? (
              <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-red-500 animate-spin" />
              </div>
            ) : (
              <motion.div
                className="w-20 h-20 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <CheckCircle className="h-10 w-10 text-red-500" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black mb-2">
            {verifying ? 'Verifying Payment...' : 'Payment Successful!'}
          </h1>
          <div className="w-12 h-0.5 bg-red-600 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-8">
            {verifying
              ? 'Please wait while we activate your subscription...'
              : 'Thank you for subscribing to Global Media Sports. Your account has been upgraded to Premium.'}
          </p>

          {/* Card */}
          {!verifying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="relative mb-6">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                <div className="relative bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 text-left space-y-3">
                  {['Premium video submission', 'Priority content review', 'Social media management', 'Monthly performance reports'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
