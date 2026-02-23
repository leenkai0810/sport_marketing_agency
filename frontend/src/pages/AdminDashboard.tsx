import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            navigate('/dashboard'); // or login
            return;
        }
        setUser(currentUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const usersData = await adminApi.getAllUsers();
            const videosData = await adminApi.getAllVideos();
            setUsers(usersData);
            setVideos(videosData);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
            toast.error(t('admin.fetchFailed', 'Failed to fetch data'));
        }
    };

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await adminApi.updateVideoStatus(id, status);
            const msg = status === 'APPROVED' ? t('admin.approvedMsg', 'Video approved') : t('admin.rejectedMsg', 'Video rejected');
            toast.success(msg);
            fetchData(); // Refresh list
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || t('admin.updateFailed', 'Failed to update status');
            toast.error(errorMessage);
        }
    };

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="container py-10 min-h-screen">
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
                        <LanguageSwitcher isDark={true} />
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

            <div className="pt-24 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t('admin.title', 'Admin Panel')}</h1>
                <p className="text-gray-500">{t('admin.desc', 'Manage users and content.')}</p>
            </div>

            <Tabs defaultValue="videos" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="videos">{t('admin.videosReview', 'Videos Review')}</TabsTrigger>
                    <TabsTrigger value="users">{t('admin.usersManagement', 'Users Management')}</TabsTrigger>
                </TabsList>

                <TabsContent value="videos">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.videoSubmissions', 'Video Submissions')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('admin.user', 'User')}</TableHead>
                                        <TableHead>{t('dashboard.platform', 'Platform')}</TableHead>
                                        <TableHead>{t('dashboard.caption', 'Caption')}</TableHead>
                                        <TableHead>{t('admin.status', 'Status')}</TableHead>
                                        <TableHead>{t('admin.date', 'Date')}</TableHead>
                                        <TableHead>{t('admin.actions', 'Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videos.map((video) => (
                                        <TableRow key={video.id}>
                                            <TableCell>{video.user.name}</TableCell>
                                            <TableCell>{video.platform}</TableCell>
                                            <TableCell className="max-w-xs truncate">{video.caption}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${video.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    video.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {t(`status.${video.status.toLowerCase()}`, video.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="space-x-2">
                                                {video.status === 'PENDING' && (
                                                    <>
                                                        <Button size="sm" onClick={() => handleStatusUpdate(video.id, 'APPROVED')}>{t('admin.approve', 'Approve')}</Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(video.id, 'REJECTED')}>{t('admin.reject', 'Reject')}</Button>
                                                    </>
                                                )}
                                                <a href={video.url.startsWith('http') ? video.url : `http://localhost:5000/uploads/${video.url}`} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-600 text-sm">
                                                    {t('admin.view', 'View')}
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.registeredUsers', 'Registered Users')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('user.name', 'Name')}</TableHead>
                                        <TableHead>{t('user.email', 'Email')}</TableHead>
                                        <TableHead>{t('user.role', 'Role')}</TableHead>
                                        <TableHead>{t('admin.subscription', 'Subscription')}</TableHead>
                                        <TableHead>{t('admin.joined', 'Joined')}</TableHead>
                                        <TableHead>{t('admin.actions', 'Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>{u.role}</TableCell>
                                            <TableCell>
                                                {u.subscriptionStatus === 'ACTIVE' ? t('dashboard.activePrem', 'Active (Premium)') : t('dashboard.inactiveFree', 'Inactive (Free)')}
                                            </TableCell>
                                            <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="outline" onClick={() => navigate(`/admin/users/${u.id}`)}>
                                                    {t('admin.viewProfile', 'View Profile')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;

