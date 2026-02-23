import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Phone, MapPin, Instagram, Youtube, Video, CreditCard, Calendar } from 'lucide-react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const AdminUserProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }

        if (id) {
            fetchUser(id);
        }
    }, [id, navigate]);

    const fetchUser = async (userId: string) => {
        try {
            setLoading(true);
            const data = await adminApi.getUserById(userId);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            toast.error(t('admin.fetchFailed', 'Failed to fetch user data'));
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-900 text-xl">{t('common.loading', 'Loading...')}</div>
            </div>
        );
    }

    if (!user) return null;

    const isPremium = user.subscriptionStatus === 'ACTIVE' || user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-12 h-12 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold text-gray-900">Global</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Media Sports</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher isDark={false} />
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-white border-gray-200 px-6 py-2.5 h-auto"
                        >
                            {t('auth.logout', 'Logout')}
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-white border-gray-200" onClick={() => navigate('/admin')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t('admin.backBtn', 'Back to Admin')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${isPremium ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                    {isPremium ? t('admin.premium', 'Premium') : t('admin.freeUser', 'Free User')}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center mt-2">
                                <div className="w-24 h-24 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-red-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-1 text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                                <div className="w-full h-px bg-gray-100 my-4" />

                                <div className="w-full flex justify-between items-center text-sm">
                                    <span className="text-gray-500"><Calendar className="w-4 h-4 inline mr-2 align-text-bottom text-gray-400" />{t('admin.joined', 'Joined')}</span>
                                    <span className="font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full flex justify-between items-center text-sm mt-3">
                                    <span className="text-gray-500"><CreditCard className="w-4 h-4 inline mr-2 align-text-bottom text-gray-400" />{t('admin.role', 'Role')}</span>
                                    <span className="font-medium text-gray-700">{user.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{t('admin.metrics', 'Metrics')}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="text-gray-500 text-xs mb-1 font-medium uppercase">{t('admin.totalVideos', 'Total Videos')}</div>
                                    <div className="text-2xl font-black text-gray-900">{user.videos?.length || 0}</div>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <div className="text-emerald-700 text-xs mb-1 font-medium uppercase">{t('admin.approved', 'Approved')}</div>
                                    <div className="text-2xl font-black text-emerald-600">
                                        {user.videos?.filter((v: any) => v.status === 'APPROVED').length || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Videos */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Additional Information Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{t('admin.regDetails', 'Registration Details')}</h2>
                                    <p className="text-gray-500 text-sm">{t('admin.regDetailsDesc', 'Additional info collected during registration.')}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" /> {t('user.phone', 'Phone Number')}
                                        </dt>
                                        <dd className="text-gray-900 font-medium bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg">
                                            {user.phone || <span className="text-gray-400 italic">{t('common.notProvided', 'Not provided')}</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" /> {t('user.primarySport', 'Primary Sport')}
                                        </dt>
                                        <dd className="text-gray-900 font-medium bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg capitalize">
                                            {user.sport || <span className="text-gray-400 italic">{t('common.notProvided', 'Not provided')}</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Instagram className="w-3.5 h-3.5" /> Instagram
                                        </dt>
                                        <dd className="text-gray-900 font-medium bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg">
                                            {user.instagram || <span className="text-gray-400 italic">{t('common.notProvided', 'Not provided')}</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Youtube className="w-3.5 h-3.5" /> TikTok
                                        </dt>
                                        <dd className="text-gray-900 font-medium bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg">
                                            {user.tiktok || <span className="text-gray-400 italic">{t('common.notProvided', 'Not provided')}</span>}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Recent Video Submissions List */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{t('admin.usersVideos', "User's Videos")}</h2>
                                    <p className="text-gray-500 text-sm">{t('admin.usersVideosDesc', 'All video submissions by this user.')}</p>
                                </div>
                            </div>
                            <div className="p-0">
                                {user.videos && user.videos.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {user.videos.map((video: any) => (
                                            <div key={video.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors">
                                                <div className="w-full sm:w-48 aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    {video.url ? (
                                                        <video
                                                            src={video.url.startsWith('http') ? video.url : `http://localhost:5000/uploads/${video.url}`}
                                                            className="w-full h-full object-cover"
                                                            controls
                                                        />
                                                    ) : (
                                                        <Video className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{video.platform}</span>
                                                            <span className="text-gray-500 text-xs">• {new Date(video.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${video.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                            video.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-200' :
                                                                'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                                            }`}>
                                                            {t(`status.${video.status.toLowerCase()}`, video.status)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">{video.caption || t('admin.noCaption', 'No caption provided.')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <Video className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">{t('admin.noVideosSubmitted', 'No videos submitted yet.')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfile;
