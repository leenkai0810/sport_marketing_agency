import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Phone, MapPin, Instagram, Youtube, Video, CreditCard, Calendar } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    const isPremium = user.subscriptionStatus === 'ACTIVE' || user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-16">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-zinc-800" onClick={() => navigate('/admin')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t('admin.backBtn', 'Back to Admin')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${isPremium ? 'bg-red-600/20 text-red-500 border border-red-600/30' : 'bg-zinc-800 text-gray-400 border border-zinc-700'}`}>
                                    {isPremium ? 'Premium' : 'Free User'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center mt-2">
                                <div className="w-24 h-24 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-red-500" />
                                </div>
                                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                                <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                                <div className="w-full h-px bg-zinc-800 my-4" />

                                <div className="w-full flex justify-between items-center text-sm">
                                    <span className="text-gray-500"><Calendar className="w-4 h-4 inline mr-2 align-text-bottom text-gray-400" />Joined</span>
                                    <span className="font-medium text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full flex justify-between items-center text-sm mt-3">
                                    <span className="text-gray-500"><CreditCard className="w-4 h-4 inline mr-2 align-text-bottom text-gray-400" />Role</span>
                                    <span className="font-medium text-gray-300">{user.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                                    <div className="text-gray-500 text-xs mb-1 font-medium uppercase">Total Videos</div>
                                    <div className="text-2xl font-black text-white">{user.videos?.length || 0}</div>
                                </div>
                                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                                    <div className="text-gray-500 text-xs mb-1 font-medium uppercase">Approved</div>
                                    <div className="text-2xl font-black text-emerald-500">
                                        {user.videos?.filter((v: any) => v.status === 'APPROVED').length || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Videos */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Additional Information Card */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                                <h2 className="text-lg font-bold">Registration Details</h2>
                                <p className="text-gray-500 text-sm">Additional info collected during registration.</p>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" /> Phone Number
                                        </dt>
                                        <dd className="text-gray-200 font-medium bg-zinc-950 px-3 py-2 border border-zinc-800 rounded-lg">
                                            {user.phone || <span className="text-zinc-600 italic">Not provided</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" /> Primary Sport
                                        </dt>
                                        <dd className="text-gray-200 font-medium bg-zinc-950 px-3 py-2 border border-zinc-800 rounded-lg capitalize">
                                            {user.sport || <span className="text-zinc-600 italic">Not provided</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Instagram className="w-3.5 h-3.5" /> Instagram
                                        </dt>
                                        <dd className="text-gray-200 font-medium bg-zinc-950 px-3 py-2 border border-zinc-800 rounded-lg">
                                            {user.instagram || <span className="text-zinc-600 italic">Not provided</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Youtube className="w-3.5 h-3.5" /> TikTok
                                        </dt>
                                        <dd className="text-gray-200 font-medium bg-zinc-950 px-3 py-2 border border-zinc-800 rounded-lg">
                                            {user.tiktok || <span className="text-zinc-600 italic">Not provided</span>}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Recent Video Submissions List (Optional) */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold">User's Videos</h2>
                                    <p className="text-gray-500 text-sm">All video submissions by this user.</p>
                                </div>
                            </div>
                            <div className="p-0">
                                {user.videos && user.videos.length > 0 ? (
                                    <div className="divide-y divide-zinc-800">
                                        {user.videos.map((video: any) => (
                                            <div key={video.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-zinc-800/20 transition-colors">
                                                <div className="w-full sm:w-48 aspect-video bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                                    {video.url ? (
                                                        <video
                                                            src={video.url.startsWith('http') ? video.url : `http://localhost:5000/uploads/${video.url}`}
                                                            className="w-full h-full object-cover opacity-80"
                                                            controls
                                                        />
                                                    ) : (
                                                        <Video className="w-8 h-8 text-zinc-700" />
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-white">{video.platform}</span>
                                                            <span className="text-zinc-500 text-xs">• {new Date(video.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${video.status === 'APPROVED' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' :
                                                                video.status === 'REJECTED' ? 'bg-red-900/30 text-red-500 border border-red-800' :
                                                                    'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                                                            }`}>
                                                            {video.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{video.caption || 'No caption provided.'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center flex flex-col items-center justify-center">
                                        <Video className="w-10 h-10 text-zinc-800 mb-3" />
                                        <p className="text-gray-500 font-medium">No videos submitted yet.</p>
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
