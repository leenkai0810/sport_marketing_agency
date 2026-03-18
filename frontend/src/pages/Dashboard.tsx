import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscriptionApi } from '@/api/subscription';
import { userApi } from '@/api/user';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getAPIBaseURL } from '@/lib/config';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, CreditCard, User } from 'lucide-react';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const checkUserAndContract = async () => {
            const currentUser = authApi.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                const freshUser = await userApi.getMe();
                setUser(freshUser);
                if (!freshUser.contractAccepted && freshUser.role !== 'ADMIN') {
                    navigate('/contract');
                    return;
                }
            } catch (error) {
                console.error('Failed to load user data', error);
                setUser(currentUser);
                try {
                    const status = await userApi.getContractStatus();
                    if (!status.contractAccepted && currentUser.role !== 'ADMIN') {
                        navigate('/contract');
                        return;
                    }
                } catch (contractError) {
                    console.error('Failed to check contract status', contractError);
                }
            }

            fetchVideos();
        };

        checkUserAndContract();
    }, [navigate]);

    const fetchVideos = async () => {
        try {
            // Keep video history visibility (uploads are not done via this page anymore).
            // If the backend has no videos, this will simply render an empty state.
            const { videoApi } = await import('@/api/video');
            const data = await videoApi.getMyVideos();
            setVideos(data);
        } catch (error) {
            console.error('Failed to fetch videos', error);
        }
    };

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    const handleSubscribe = async (plan: string = 'starter') => {
        try {
            const response = await subscriptionApi.createCheckoutSession(plan);
            if (response.url) window.location.href = response.url;
        } catch (error) {
            console.error('Failed to start subscription', error);
            toast.error(t('dashboard.subFailed', 'Failed to start subscription'));
        }
    };

    if (!user) return null;

    const isPremium = user.subscriptionStatus === 'ACTIVE' || user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Fixed Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-12 h-12 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold">Global</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher isDark={false} />
                        <button
                            onClick={handleLogout}
                            className="text-base font-medium text-gray-300 hover:text-white px-6 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
                        >
                            {t('auth.logout', 'Logout')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

            {/* Page Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
                {/* Header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-black mb-1">{t('dashboard.title', 'Dashboard')}</h1>
                    <div className="w-12 h-0.5 bg-red-600 mb-3" />
                    <p className="text-gray-400">{t('dashboard.welcomeBack', 'Welcome back, {{name}}!', { name: user.name })}</p>
                </motion.div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 rounded-lg px-5 py-2 text-sm font-medium transition-all"
                        >
                            {t('dashboard.overview', 'Overview')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 rounded-lg px-5 py-2 text-sm font-medium transition-all"
                        >
                            {t('dashboard.profile', 'Profile')}
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Overview Tab ── */}
                    <TabsContent value="overview" className="space-y-8">

                        {/* ── Pricing Plans (non-premium only) ── */}
                        {!isPremium && (
                            <motion.div
                                id="pricing-section"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h3 className="text-xl font-bold mb-2">{t('dashboard.choosePlan', 'Choose Your Plan')}</h3>
                                <p className="text-gray-500 text-sm mb-6">{t('dashboard.choosePlanDesc', 'Upgrade to unlock professional content creation and brand exposure.')}</p>
                                <div className="grid gap-6 md:grid-cols-3">

                                    {/* Starter */}
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        className="relative group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col"
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-b from-zinc-700/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex flex-col flex-1">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800 text-gray-400 text-xs font-semibold uppercase tracking-wider w-fit mb-4">{t('pricing.starterTitle', 'Starter')}</div>
                                            <div className="mb-1">
                                                <span className="text-4xl font-black text-white">€99</span>
                                                <span className="text-gray-500 text-sm ml-1">{t('pricing.month', '/month')}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-5">{t('pricing.starterDesc', 'Perfect for rising athletes')}</p>
                                            <ul className="space-y-2.5 mb-6 flex-1">
                                                {[t('pricing.starterFeatures.setup', 'TikTok & Instagram account setup'), t('pricing.starterFeatures.videos', '4 edited videos and 4 stories/month'), t('pricing.starterFeatures.strategy', 'Basic content strategy'), t('pricing.starterFeatures.report', 'Monthly performance report'), t('pricing.starterFeatures.support', 'Email support')].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-red-500 mt-0.5">✓</span>{f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                onClick={() => handleSubscribe('starter')}
                                                variant="outline"
                                                className="w-full border-zinc-600 text-white hover:bg-zinc-800 hover:text-white hover:border-zinc-500 font-black tracking-wider uppercase py-5"
                                            >
                                                {t('nav.getStarted', 'Get Started')}
                                            </Button>
                                        </div>
                                    </motion.div>

                                    {/* Pro */}
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        className="relative group rounded-2xl flex flex-col"
                                    >
                                        <div className="absolute -inset-[2px] bg-gradient-to-b from-red-600 via-red-600/60 to-transparent rounded-2xl" />
                                        <div className="relative bg-zinc-900 rounded-2xl p-6 flex flex-col flex-1">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{t('pricing.mostPopular', 'Most Popular')}</span>
                                            </div>
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold uppercase tracking-wider w-fit mb-4 mt-2">{t('pricing.proTitle', 'Pro')}</div>
                                            <div className="mb-1">
                                                <span className="text-4xl font-black text-red-500">€249</span>
                                                <span className="text-gray-500 text-sm ml-1">{t('pricing.month', '/month')}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-5">{t('pricing.proDesc', 'For athletes who want to go pro')}</p>
                                            <ul className="space-y-2.5 mb-6 flex-1">
                                                {[t('pricing.proFeatures.everything', 'Everything in Starter'), t('pricing.proFeatures.videos', '8 edited videos and 8 stories/month'), t('pricing.proFeatures.strategy', 'Advanced content strategy'), t('pricing.proFeatures.partnerships', 'Brand partnership outreach'), t('pricing.proFeatures.reports', 'Monthly performance reports'), t('pricing.proFeatures.priority', 'Priority support'), t('pricing.proFeatures.thumbnails', 'Custom thumbnails & graphics'), t('pricing.proFeatures.trends', 'Trend analysis & recommendations')].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-red-500 mt-0.5">✓</span>{f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                onClick={() => handleSubscribe('pro')}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-wider uppercase py-5"
                                            >
                                                {t('nav.getStarted', 'Get Started')}
                                            </Button>
                                        </div>
                                    </motion.div>

                                    {/* Elite */}
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        className="relative group rounded-2xl flex flex-col"
                                    >
                                        <div className="absolute -inset-[1px] bg-gradient-to-b from-yellow-500/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider">{t('pricing.eliteTitle', 'Elite')}</div>
                                                <span className="text-yellow-400 text-lg">★</span>
                                            </div>
                                            <div className="mb-1">
                                                <span className="text-4xl font-black text-yellow-400">€399</span>
                                                <span className="text-gray-500 text-sm ml-1">{t('pricing.month', '/month')}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-5">{t('pricing.eliteDesc', 'Maximum reach and visibility')}</p>
                                            <ul className="space-y-2.5 mb-6 flex-1">
                                                {[t('pricing.eliteFeatures.everything', 'Everything in Pro'), t('pricing.eliteFeatures.unlimited', '12 videos and 12 stories/month'), t('pricing.eliteFeatures.manager', 'Dedicated account manager'), t('pricing.eliteFeatures.connections', 'Direct team/brand connections'), t('pricing.eliteFeatures.daily', 'Daily content posting'), t('pricing.eliteFeatures.support247', '24/7 priority support'), t('pricing.eliteFeatures.sponsorship', 'Sponsorship negotiation'), t('pricing.eliteFeatures.press', 'Press release distribution')].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-yellow-400 mt-0.5">✓</span>{f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                onClick={() => handleSubscribe('elite')}
                                                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-wider uppercase py-5"
                                            >
                                                {t('nav.getStarted', 'Get Started')}
                                            </Button>
                                        </div>
                                    </motion.div>

                                </div>
                            </motion.div>
                        )}
                    </TabsContent>

                    {/* ── Profile Tab ── */}
                    <TabsContent value="profile">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative max-w-xl">
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/10 to-zinc-700/10 rounded-2xl" />
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                    {/* Avatar header */}
                                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 px-8 pt-8 pb-6 border-b border-zinc-800 flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center">
                                            <User className="w-7 h-7 text-red-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">{user.name}</h2>
                                            <p className="text-gray-400 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-base font-semibold mb-1">{t('dashboard.profileDetails', 'Profile Details')}</h3>
                                        <p className="text-gray-500 text-xs mb-6">{t('dashboard.manageAccount', 'Manage your account information.')}</p>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('user.name', 'Name')}</Label>
                                                <Input
                                                    value={user.name}
                                                    disabled
                                                    className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('user.email', 'Email')}</Label>
                                                <Input
                                                    value={user.email}
                                                    disabled
                                                    className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('user.role', 'Role')}</Label>
                                                <Input
                                                    value={user.role}
                                                    disabled
                                                    className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                />
                                            </div>
                                            {(user.phone || user.sport || user.instagram || user.tiktok) && (
                                                <>
                                                    <div className="pt-4 border-t border-zinc-800">
                                                        <h4 className="text-sm font-semibold mb-4 text-white">{t('dashboard.additionalInfo', 'Additional Information')}</h4>
                                                    </div>
                                                    {user.phone && (
                                                        <div>
                                                            <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('registration.phone', 'Phone Number')}</Label>
                                                            <Input
                                                                value={user.phone}
                                                                disabled
                                                                className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                            />
                                                        </div>
                                                    )}
                                                    {user.sport && (
                                                        <div>
                                                            <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('registration.sport', 'Primary Sport')}</Label>
                                                            <Input
                                                                value={user.sport}
                                                                disabled
                                                                className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70 capitalize"
                                                            />
                                                        </div>
                                                    )}
                                                    {user.instagram && (
                                                        <div>
                                                            <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('registration.instagram', 'Instagram Handle')}</Label>
                                                            <Input
                                                                value={user.instagram}
                                                                disabled
                                                                className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                            />
                                                        </div>
                                                    )}
                                                    {user.tiktok && (
                                                        <div>
                                                            <Label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">{t('registration.tiktok', 'TikTok Handle')}</Label>
                                                            <Input
                                                                value={user.tiktok}
                                                                disabled
                                                                className="bg-zinc-800 border-zinc-700 text-white h-11 disabled:opacity-70"
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
};

export default Dashboard;
