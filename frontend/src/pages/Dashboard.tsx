import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Widget } from '@uploadcare/react-widget';
import { authApi } from '@/api/auth';
import { videoApi } from '@/api/video';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscriptionApi } from '@/api/subscription';
import { userApi } from '@/api/user';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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

            // Fetch fresh user data from backend (not stale JWT)
            try {
                const freshUser = await userApi.getMe();
                setUser(freshUser); // Use live DB data for display

                // Check contract
                if (!freshUser.contractAccepted && freshUser.role !== 'ADMIN') {
                    navigate('/contract');
                    return;
                }
            } catch (error) {
                console.error('Failed to load user data', error);
                // Fallback to JWT data
                setUser(currentUser);

                // Still check contract via old API
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
            await videoApi.uploadVideo({
                url: uploadedUrl,
                caption,
                platform
            });
            toast.success(t('dashboard.uploadSuccess', 'Video uploaded successfully!'));
            setUploadedUrl(null);
            setCaption('');
            if (widgetApi.current) {
                widgetApi.current.value(null);
            }
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
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Failed to start subscription', error);
            toast.error(t('dashboard.subFailed', 'Failed to start subscription'));
        }
    };

    if (!user) return null;

    return (
        <div className="container py-10 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t('dashboard.title', 'Dashboard')}</h1>
                    <p className="text-gray-500">{t('dashboard.welcomeBack', 'Welcome back, {{name}}!', { name: user.name })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hidden sm:block">
                        <LanguageSwitcher isDark={true} />
                    </div>
                    <Button variant="outline" onClick={handleLogout}>{t('auth.logout', 'Logout')}</Button>
                </div>
            </div>

            <div className="sm:hidden mb-6 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm inline-block">
                <LanguageSwitcher isDark={true} />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">{t('dashboard.overview', 'Overview')}</TabsTrigger>
                    <TabsTrigger value="upload">{t('dashboard.upload', 'Upload Video')}</TabsTrigger>
                    <TabsTrigger value="profile">{t('dashboard.profile', 'Profile')}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('dashboard.subStatus', 'Subscription Status')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold capitalize">
                                    {user.subscriptionStatus === 'ACTIVE' ? t('dashboard.activePrem', 'Active (Premium)') : t('dashboard.inactiveFree', 'Inactive (Free)')}
                                </div>
                                {user.subscriptionStatus !== 'ACTIVE' && user.role !== 'ADMIN' && (
                                    <Button onClick={handleSubscribe} size="sm" className="mt-2 w-full">
                                        {t('dashboard.upgradeBtn', 'Upgrade to Premium')}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('dashboard.videosUploaded', 'Videos Uploaded')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{videos.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <h3 className="text-xl font-semibold mt-8 mb-4">{t('dashboard.recentVideos', 'Your Recent Videos')}</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {videos.length === 0 ? (
                            <p className="text-gray-500 col-span-full">{t('dashboard.noVideos', 'No videos uploaded yet.')}</p>
                        ) : (
                            videos.map((video) => (
                                <Card key={video.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{video.platform}</CardTitle>
                                        <CardDescription>{new Date(video.createdAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2 overflow-hidden">
                                            {video.url ? (
                                                <video
                                                    src={video.url.startsWith('http') ? video.url : `http://localhost:5000/uploads/${video.url}`}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <span className="text-gray-400">{t('dashboard.videoUnavailable', 'Video Unavailable')}</span>
                                            )}
                                        </div>
                                        <p className="text-sm truncate">{video.caption}</p>
                                        <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${video.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            video.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {t(`status.${video.status.toLowerCase()}`, video.status)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="upload">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.uploadContent', 'Upload Content')}</CardTitle>
                            <CardDescription>
                                {t('dashboard.uploadDesc', 'Submit your sports highlights for review.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-6 max-w-xl">
                                <div className="space-y-2">
                                    <Label htmlFor="platform">{t('dashboard.platform', 'Platform')}</Label>
                                    <Select value={platform} onValueChange={setPlatform}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('dashboard.selectPlatform', 'Select platform')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Instagram">Instagram</SelectItem>
                                            <SelectItem value="TikTok">TikTok</SelectItem>
                                            <SelectItem value="Facebook">Facebook</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="caption">{t('dashboard.caption', 'Caption/Description')}</Label>
                                    <Input
                                        id="caption"
                                        placeholder={t('dashboard.descHighlight', 'Describe your highlight...')}
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('dashboard.videoFile', 'Video File')}</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center bg-white">
                                        <Widget
                                            publicKey={import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY || ''}
                                            onChange={(info) => setUploadedUrl(info.cdnUrl)}
                                            ref={widgetApi}
                                            clearable
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={isUploading}>
                                    {isUploading ? t('dashboard.uploading', 'Uploading...') : t('dashboard.submitReview', 'Submit for Review')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('dashboard.profileDetails', 'Profile Details')}</CardTitle>
                            <CardDescription>
                                {t('dashboard.manageAccount', 'Manage your account information.')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>{t('user.name', 'Name')}</Label>
                                    <Input value={user.name} disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('user.email', 'Email')}</Label>
                                    <Input value={user.email} disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('user.role', 'Role')}</Label>
                                    <Input value={user.role} disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Dashboard;
