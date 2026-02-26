import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { editorApi } from '@/api/editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Download, Upload, CheckCircle, Clock, FileText, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getAPIBaseURL } from '@/lib/config';

const STATUS_STYLES: Record<string, { bg: string; text: string; labelKey: string }> = {
    PENDING: { bg: 'bg-amber-600/20', text: 'text-amber-400', labelKey: 'status.pending' },
    EDITING: { bg: 'bg-blue-600/20', text: 'text-blue-400', labelKey: 'status.editing' },
    READY: { bg: 'bg-green-600/20', text: 'text-green-400', labelKey: 'status.ready' },
    PUBLISHED: { bg: 'bg-purple-600/20', text: 'text-purple-400', labelKey: 'status.published' },
    REJECTED: { bg: 'bg-red-600/20', text: 'text-red-400', labelKey: 'status.rejected' },
};

const EditorDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [queue, setQueue] = useState<any[]>([]);
    const [myVideos, setMyVideos] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('queue');
    const [isLoading, setIsLoading] = useState(true);
    const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const API_URL = getAPIBaseURL();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || (currentUser.role !== 'EDITOR' && currentUser.role !== 'ADMIN')) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [q, my] = await Promise.all([
                editorApi.getQueue(),
                editorApi.getMyVideos(),
            ]);
            setQueue(q);
            setMyVideos(my);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (videoId: string) => {
        try {
            await editorApi.assignToSelf(videoId);
            toast.success(t('editor.videoClaimed'));
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('editor.claimFailed'));
        }
    };

    const handleUploadEdited = async (videoId: string, file: File) => {
        setUploadingId(videoId);
        try {
            await editorApi.uploadEdited(videoId, file);
            toast.success(t('editor.uploadSuccess'));
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('editor.uploadFailed'));
        } finally {
            setUploadingId(null);
        }
    };

    const handleMarkReady = async (videoId: string) => {
        try {
            await editorApi.markReady(videoId);
            toast.success(t('editor.readySuccess'));
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('editor.readyFailed'));
        }
    };

    const handleSaveNotes = async (videoId: string) => {
        try {
            await editorApi.addNotes(videoId, editingNotes[videoId] || '');
            toast.success(t('editor.notesSaved'));
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('editor.notesFailed'));
        }
    };

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    const VideoCard = ({ video, showClaim = false }: { key?: React.Key; video: any; showClaim?: boolean }) => {
        const status = STATUS_STYLES[video.status] || STATUS_STYLES.PENDING;

        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
                {/* Video Preview */}
                <div className="aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                    <video
                        src={video.url.startsWith('http') ? video.url : `${API_URL}/api/uploads/${video.url}`}
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                        {t(status.labelKey)}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-white font-semibold text-sm">{video.caption || t('editor.noCaption')}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-400 text-xs">{video.user?.name || video.user?.email}</span>
                                <span className="text-zinc-700">•</span>
                                <span className="text-gray-500 text-xs">{video.platform}</span>
                            </div>
                            {video.user?.sport && (
                                <span className="text-xs text-gray-600 mt-1 block">{t('editor.sport')}: {video.user.sport}</span>
                            )}
                        </div>
                        {/* Download Original */}
                        <a
                            href={video.url.startsWith('http') ? video.url : `${API_URL}/api/uploads/${video.url}`}
                            download
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                            title={t('editor.downloadOriginal')}
                        >
                            <Download className="w-4 h-4 text-gray-400" />
                        </a>
                    </div>

                    {/* Claim button for queue */}
                    {showClaim && (
                        <Button
                            onClick={() => handleClaim(video.id)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-4"
                        >
                            {t('editor.claimVideo')}
                        </Button>
                    )}

                    {/* Editor actions for assigned videos */}
                    {!showClaim && video.status === 'EDITING' && (
                        <div className="space-y-3 pt-2 border-t border-zinc-800">
                            {/* Upload Edited */}
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    ref={el => fileInputRefs.current[video.id] = el}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUploadEdited(video.id, file);
                                    }}
                                />
                                <Button
                                    onClick={() => fileInputRefs.current[video.id]?.click()}
                                    disabled={uploadingId === video.id}
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white hover:text-white text-xs font-medium py-3"
                                    variant="outline"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadingId === video.id ? t('editor.uploading') : (video.editedUrl ? t('editor.replaceEdited') : t('editor.uploadEdited'))}
                                </Button>
                                {video.editedUrl && (
                                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> {t('editor.editedUploaded')}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <Label className="text-gray-400 text-xs">{t('editor.editorNotes')}</Label>
                                <Textarea
                                    value={editingNotes[video.id] ?? video.editorNotes ?? ''}
                                    onChange={(e) => setEditingNotes(prev => ({ ...prev, [video.id]: e.target.value }))}
                                    placeholder={t('editor.notesPlaceholder')}
                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white text-xs min-h-[60px]"
                                />
                                <Button
                                    onClick={() => handleSaveNotes(video.id)}
                                    size="sm"
                                    disabled={!(editingNotes[video.id] ?? video.editorNotes ?? '').trim()}
                                    className="mt-1 bg-zinc-700 hover:bg-zinc-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FileText className="w-3 h-3 mr-1" /> {t('editor.saveNotes')}
                                </Button>
                            </div>

                            {/* Mark Ready */}
                            <Button
                                onClick={() => handleMarkReady(video.id)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-4"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> {t('editor.markReady')}
                            </Button>
                        </div>
                    )}

                    {/* Show edited video preview */}
                    {video.editedUrl && video.status !== 'EDITING' && (
                        <div className="pt-2 border-t border-zinc-800">
                            <p className="text-gray-500 text-xs mb-1">{t('editor.editedVersion')}</p>
                            <video
                                src={video.editedUrl.startsWith('http') ? video.editedUrl : `${API_URL}/api/uploads/${video.editedUrl}`}
                                className="w-full rounded-lg"
                                controls
                                preload="metadata"
                            />
                        </div>
                    )}

                    {/* Show notes read-only */}
                    {video.editorNotes && video.status !== 'EDITING' && (
                        <div className="pt-2 border-t border-zinc-800">
                            <p className="text-gray-500 text-xs">{t('editor.notes')} <span className="text-gray-300">{video.editorNotes}</span></p>
                        </div>
                    )}

                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header - Global Media Sports branding like AdminDashboard */}
            <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/LOGO.png" alt="Global Media Sports" className="w-12 h-12 object-contain" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold text-white">Global</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Media Sports</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        {user && (
                            <div className="hidden md:flex items-center gap-2 border-r border-zinc-800 pr-4">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-200">{user.name}</span>
                            </div>
                        )}
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:text-gray-300 text-xs"
                        >
                            <LogOut className="w-4 h-4 mr-1" /> {t('auth.logout')}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black tracking-tight text-white">{t('editor.title')}</h1>
                    <p className="text-gray-500 text-xs mt-1">{t('editor.subtitle')}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: t('editor.inQueue'), value: queue.length, color: 'text-amber-400' },
                        { label: t('editor.myEditing'), value: myVideos.filter(v => v.status === 'EDITING').length, color: 'text-blue-400' },
                        { label: t('editor.ready'), value: myVideos.filter(v => v.status === 'READY').length, color: 'text-green-400' },
                        { label: t('editor.published'), value: myVideos.filter(v => v.status === 'PUBLISHED').length, color: 'text-purple-400' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 mb-8">
                    {['queue', 'mywork'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-red-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            {tab === 'queue' ? `📥 ${t('editor.videoQueue')} (${queue.length})` : `🎬 ${t('editor.myWork')} (${myVideos.length})`}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto" />
                        <p className="text-gray-500 text-sm mt-4">{t('editor.loading')}</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'queue' && (
                            <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {queue.length === 0 ? (
                                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <Video className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium">{t('editor.queueEmpty')}</p>
                                        <p className="text-gray-600 text-sm">{t('editor.queueEmptyDesc')}</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {queue.map(video => (
                                            <VideoCard key={video.id} video={video} showClaim />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'mywork' && (
                            <motion.div key="mywork" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {myVideos.length === 0 ? (
                                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <Video className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium">{t('editor.noAssigned')}</p>
                                        <p className="text-gray-600 text-sm">{t('editor.noAssignedDesc')}</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myVideos.map(video => (
                                            <VideoCard key={video.id} video={video} />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default EditorDashboard;
