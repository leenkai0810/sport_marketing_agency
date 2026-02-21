import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userApi } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Contract = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async () => {
        if (!accepted) {
            toast.error('You must accept the contract to proceed.');
            return;
        }

        setIsLoading(true);
        try {
            await userApi.acceptContract();
            toast.success('Contract accepted successfully.');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to accept contract.');
        } finally {
            setIsLoading(false);
        }
    };

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
            <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-24 pb-12">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black mb-2">Digital Representation Agreement</h1>
                        <div className="w-16 h-0.5 bg-red-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Please review and accept the terms of our representation agreement.</p>
                    </div>

                    {/* Card */}
                    <div className="relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/20 to-zinc-700/20 rounded-2xl" />
                        <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden">
                            {/* Contract text */}
                            <div className="h-80 overflow-y-auto p-8 border-b border-zinc-800 text-sm text-gray-300 space-y-4 scrollbar-thin">
                                <div>
                                    <h3 className="font-bold text-white mb-1">1. Parties</h3>
                                    <p className="text-gray-400">This Agreement is between Global Media Sports ("Agency") and the User ("Athlete").</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">2. Services</h3>
                                    <p className="text-gray-400">Agency agrees to promote Athlete's sports highlights on social media platforms including but not limited to Instagram, TikTok, and Facebook.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">3. Rights</h3>
                                    <p className="text-gray-400">Athlete grants Agency a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display the uploaded content for marketing and promotional purposes.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">4. Term</h3>
                                    <p className="text-gray-400">This agreement is effective upon acceptance and continues as long as the Athlete maintains an account with the Agency.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">5. Disclaimer</h3>
                                    <p className="text-gray-400">Agency does not guarantee specific results, such as recruitment by professional teams or sponsorship deals.</p>
                                </div>
                                <p className="text-xs text-zinc-600 pt-4">Last Updated: {new Date().toLocaleDateString()}</p>
                            </div>

                            {/* Footer */}
                            <div className="p-8 space-y-5">
                                <div className="flex items-center space-x-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
                                    <Checkbox
                                        id="accept"
                                        checked={accepted}
                                        onCheckedChange={(checked) => setAccepted(checked as boolean)}
                                        className="border-zinc-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                    />
                                    <Label htmlFor="accept" className="text-sm text-gray-200 cursor-pointer">
                                        I have read and agree to the Digital Representation Agreement
                                    </Label>
                                </div>
                                <Button
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 disabled:opacity-50"
                                    onClick={handleAccept}
                                    disabled={!accepted || isLoading}
                                >
                                    {isLoading ? 'Processing...' : 'Accept & Continue'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contract;
