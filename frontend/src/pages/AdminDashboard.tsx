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
import { getAPIBaseURL } from '@/lib/config';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-800' },
    EDITING: { bg: 'bg-blue-100', text: 'text-blue-800' },
    READY: { bg: 'bg-green-100', text: 'text-green-800' },
    PUBLISHED: { bg: 'bg-purple-100', text: 'text-purple-800' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-800' },
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [editors, setEditors] = useState<any[]>([]);

    const API_URL = getAPIBaseURL();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        setUser(currentUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [usersData, videosData, editorsData] = await Promise.all([
                adminApi.getAllUsers(),
                adminApi.getAllVideos(),
                adminApi.getEditors(),
            ]);
            setUsers(usersData);
            setVideos(videosData);
            setEditors(editorsData);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
            toast.error(t('admin.fetchFailed', 'Failed to fetch data'));
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await adminApi.updateVideoStatus(id, status);
            toast.success(t('admin.statusUpdated', `Video marked as ${status}`));
            fetchData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || t('admin.updateFailed', 'Failed to update status'));
        }
    };

    const handleAssignEditor = async (videoId: string, editorId: string) => {
        try {
            await adminApi.assignEditor(videoId, editorId);
            toast.success('Editor assigned!');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign editor');
        }
    };

    const handleRoleUpdate = async (userId: string, role: string) => {
        try {
            await adminApi.updateUserRole(userId, role);
            toast.success(`User role updated to ${role}`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update role');
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
                <p className="text-gray-500">{t('admin.desc', 'Manage users, editors, and content pipeline.')}</p>
            </div>

            <Tabs defaultValue="videos" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="videos">{t('admin.videosReview', 'Content Pipeline')}</TabsTrigger>
                    <TabsTrigger value="users">{t('admin.usersManagement', 'Users & Roles')}</TabsTrigger>
                </TabsList>

                <TabsContent value="videos">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.videoSubmissions', 'Content Pipeline')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('admin.user', 'Athlete')}</TableHead>
                                        <TableHead>{t('dashboard.platform', 'Platform')}</TableHead>
                                        <TableHead>{t('dashboard.caption', 'Caption')}</TableHead>
                                        <TableHead>Editor</TableHead>
                                        <TableHead>{t('admin.status', 'Status')}</TableHead>
                                        <TableHead>{t('admin.date', 'Date')}</TableHead>
                                        <TableHead>{t('admin.actions', 'Actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videos.map((video) => {
                                        const style = STATUS_STYLES[video.status] || STATUS_STYLES.PENDING;
                                        return (
                                            <TableRow key={video.id}>
                                                <TableCell>{video.user?.name || video.user?.email}</TableCell>
                                                <TableCell>{video.platform}</TableCell>
                                                <TableCell className="max-w-xs truncate">{video.caption}</TableCell>
                                                <TableCell className="text-sm">
                                                    {video.editor ? (
                                                        <span className="text-blue-700 font-medium">{video.editor.name || video.editor.email}</span>
                                                    ) : (
                                                        <select
                                                            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
                                                            defaultValue=""
                                                            onChange={(e) => { if (e.target.value) handleAssignEditor(video.id, e.target.value); }}
                                                        >
                                                            <option value="">Assign...</option>
                                                            {editors.map(ed => (
                                                                <option key={ed.id} value={ed.id}>{ed.name || ed.email}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}>
                                                        {t(`status.${video.status.toLowerCase()}`, video.status)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="space-x-1">
                                                    {video.status === 'READY' && (
                                                        <Button size="sm" onClick={() => handleStatusUpdate(video.id, 'PUBLISHED')} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                                                            Publish
                                                        </Button>
                                                    )}
                                                    {video.status !== 'REJECTED' && video.status !== 'PUBLISHED' && (
                                                        <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(video.id, 'REJECTED')} className="text-xs">
                                                            {t('admin.reject', 'Reject')}
                                                        </Button>
                                                    )}
                                                    <a
                                                        href={video.url.startsWith('http') ? video.url : `${API_URL}/api/uploads/${video.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-1 underline text-blue-600 text-xs"
                                                    >
                                                        {t('admin.view', 'View')}
                                                    </a>
                                                    {video.editedUrl && (
                                                        <a
                                                            href={video.editedUrl.startsWith('http') ? video.editedUrl : `${API_URL}/api/uploads/${video.editedUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-1 underline text-green-600 text-xs"
                                                        >
                                                            Edited
                                                        </a>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin.registeredUsers', 'Users & Roles')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('user.name', 'Name')}</TableHead>
                                        <TableHead>{t('user.email', 'Email')}</TableHead>
                                        <TableHead>{t('user.role', 'Role')}</TableHead>
                                        <TableHead>Plan</TableHead>
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
                                            <TableCell>
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                    className={`border rounded px-2 py-1 text-xs font-medium ${u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        u.role === 'EDITOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}
                                                    disabled={u.id === user?.id}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="EDITOR">EDITOR</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${u.plan === 'elite' ? 'bg-purple-100 text-purple-800' :
                                                    u.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                                                        u.plan === 'starter' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {u.plan || 'none'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {u.subscriptionStatus === 'ACTIVE'
                                                    ? t('dashboard.activePrem', 'Active (Premium)')
                                                    : t('dashboard.inactiveFree', 'Inactive (Free)')}
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
