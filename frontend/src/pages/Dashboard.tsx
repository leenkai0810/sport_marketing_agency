import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Widget } from '@uploadcare/react-widget';
import { authApi } from '@/api/auth';
import { videoApi } from '@/api/video';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscriptionApi } from '@/api/subscription';
import { userApi } from '@/api/user';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const widgetApi = useRef<any>(null);

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

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedUrl) {
            toast.error(t('dashboard.uploadFirst', 'Please upload a video first'));
            return;
        }

        setIsUploading(true);
        try {
            await videoApi.uploadVideo({ url: uploadedUrl, caption, platform });
            toast.success(t('dashboard.uploadSuccess', 'Video uploaded successfully!'));
            setUploadedUrl(null);
            setCaption('');
            if (widgetApi.current) widgetApi.current.value(null);
            fetchVideos();
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || t('dashboard.uploadFailed', 'Failed to upload video');
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            const response = await subscriptionApi.createCheckoutSession();
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
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all duration-200"
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
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 rounded-lg px-5 py-2 text-sm font-medium transition-all"
                        >
                            {t('dashboard.overview', 'Overview')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="upload"
                            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 rounded-lg px-5 py-2 text-sm font-medium transition-all"
                        >
                            {t('dashboard.upload', 'Upload Video')}
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
                        {/* Stat Cards */}
                        <motion.div
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Subscription Status Card */}
                            <motion.div variants={staggerItem} className="group relative">
                                <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600/30 to-zinc-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-red-500" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.subStatus', 'Subscription Status')}</span>
                                    </div>
                                    <div className={`text-xl font-bold ${isPremium ? 'text-red-400' : 'text-gray-300'}`}>
                                        {isPremium ? t('dashboard.activePrem', 'Active (Premium)') : t('dashboard.inactiveFree', 'Inactive (Free)')}
                                    </div>
                                    {!isPremium && (
                                        <Button
                                            onClick={handleSubscribe}
                                            size="sm"
                                            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                                        >
                                            {t('dashboard.upgradeBtn', 'Upgrade to Premium')}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>

                            {/* Videos count card */}
                            <motion.div variants={staggerItem} className="group relative">
                                <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600/30 to-zinc-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                                            <Video className="w-5 h-5 text-red-500" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.videosUploaded', 'Videos Uploaded')}</span>
                                    </div>
                                    <div className="text-4xl font-black text-white">{videos.length}</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Recent Videos */}
                        <div>
                            <h3 className="text-xl font-bold mb-5">{t('dashboard.recentVideos', 'Your Recent Videos')}</h3>
                            {videos.length === 0 ? (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                                    <Video className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-gray-500">{t('dashboard.noVideos', 'No videos uploaded yet.')}</p>
                                </div>
                            ) : (
                                <motion.div
                                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {videos.map((video) => (
                                        <motion.div key={video.id} variants={staggerItem} className="group relative">
                                            <div className="absolute -inset-[1px] bg-gradient-to-br from-red-600/20 to-zinc-700/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                                {/* Platform badge */}
                                                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                                        <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                                                        {video.platform}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{new Date(video.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {/* Video */}
                                                <div className="aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
                                                    {video.url ? (
                                                        <video
                                                            src={video.url.startsWith('http') ? video.url : `http://localhost:5000/uploads/${video.url}`}
                                                            className="w-full h-full object-contain"
                                                            controls
                                                            preload="metadata"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600 text-sm">{t('dashboard.videoUnavailable', 'Video Unavailable')}</span>
                                                    )}
                                                </div>
                                                {/* Caption + status */}
                                                <div className="px-5 py-4">
                                                    <p className="text-sm text-gray-300 truncate mb-3">{video.caption || '—'}</p>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${video.status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' :
                                                        video.status === 'REJECTED' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                                            'bg-amber-900/50 text-amber-400 border border-amber-800'
                                                        }`}>
                                                        {t(`status.${video.status.toLowerCase()}`, video.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── Upload Tab ── */}
                    <TabsContent value="upload">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative max-w-xl">
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-zinc-700/10 to-zinc-700/10 rounded-2xl" />
                                <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="px-8 pt-8 pb-4 border-b border-zinc-800">
                                        <h2 className="text-xl font-bold">{t('dashboard.uploadContent', 'Upload Content')}</h2>
                                        <p className="text-gray-400 text-sm mt-1">{t('dashboard.uploadDesc', 'Submit your sports highlights for review.')}</p>
                                    </div>
                                    <div className="p-8">
                                        {!isPremium ? (
                                            <div className="flex flex-col items-center justify-center py-12 space-y-5 text-center">
                                                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl">🔒</div>
                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">{t('dashboard.premiumRequired', 'Premium Required')}</h3>
                                                    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                                                        {t('dashboard.premiumRequiredDesc', 'Video uploads are available for premium members only. Upgrade your plan to start submitting your sports highlights.')}
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={handleSubscribe}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-5 text-sm transition-all hover:shadow-lg hover:shadow-red-600/30"
                                                >
                                                    {t('dashboard.upgradeBtn', 'Upgrade to Premium')}
                                                </Button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleUpload} className="space-y-6">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-200 text-sm font-medium">{t('dashboard.platform', 'Platform')}</Label>
                                                    <Select value={platform} onValueChange={setPlatform}>
                                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-11">
                                                            <SelectValue placeholder={t('dashboard.selectPlatform', 'Select platform')} />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                                            <SelectItem value="Instagram" className="text-white hover:bg-zinc-700">Instagram</SelectItem>
                                                            <SelectItem value="TikTok" className="text-white hover:bg-zinc-700">TikTok</SelectItem>
                                                            <SelectItem value="Facebook" className="text-white hover:bg-zinc-700">Facebook</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-gray-200 text-sm font-medium">{t('dashboard.caption', 'Caption/Description')}</Label>
                                                    <Input
                                                        placeholder={t('dashboard.descHighlight', 'Describe your highlight...')}
                                                        value={caption}
                                                        onChange={(e) => setCaption(e.target.value)}
                                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-11"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-gray-200 text-sm font-medium">{t('dashboard.videoFile', 'Video File')}</Label>
                                                    <div className="border-2 border-dashed border-zinc-700 hover:border-red-600/50 rounded-xl p-6 flex justify-center bg-zinc-800/30 transition-colors">
                                                        <Widget
                                                            publicKey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY || ''}
                                                            onChange={(info) => setUploadedUrl(info.cdnUrl)}
                                                            ref={widgetApi}
                                                            clearable
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isUploading}
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
                                                >
                                                    {isUploading ? t('dashboard.uploading', 'Uploading...') : t('dashboard.submitReview', 'Submit for Review')}
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* ── Profile Tab ── */}
                    <TabsContent value="profile">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative max-w-md">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
