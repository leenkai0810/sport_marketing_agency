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

    if (!user) return null;

    return (
        <div className="container py-10 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{t('admin.title', 'Admin Panel')}</h1>
                    <p className="text-gray-500">{t('admin.desc', 'Manage users and content.')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm hidden sm:block">
                        <LanguageSwitcher isDark={true} />
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>{t('admin.backBtn', 'Back to Dashboard')}</Button>
                </div>
            </div>

            <div className="sm:hidden mb-6 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm inline-block">
                <LanguageSwitcher isDark={true} />
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

