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

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-amber-600/20', text: 'text-amber-400', label: 'Pending' },
    EDITING: { bg: 'bg-blue-600/20', text: 'text-blue-400', label: 'Editing' },
    READY: { bg: 'bg-green-600/20', text: 'text-green-400', label: 'Ready' },
    PUBLISHED: { bg: 'bg-purple-600/20', text: 'text-purple-400', label: 'Published' },
    REJECTED: { bg: 'bg-red-600/20', text: 'text-red-400', label: 'Rejected' },
};

const EditorDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [queue, setQueue] = useState<any[]>([]);
    const [myVideos, setMyVideos] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('queue');
    const [isLoading, setIsLoading] = useState(true);
    const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        const user = authApi.getCurrentUser();
        if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
            navigate('/login');
            return;
        }
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
            toast.success('Video claimed! It\'s now in your work queue.');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to claim video');
        }
    };

    const handleUploadEdited = async (videoId: string, file: File) => {
        setUploadingId(videoId);
        try {
            await editorApi.uploadEdited(videoId, file);
            toast.success('Edited video uploaded!');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload');
        } finally {
            setUploadingId(null);
        }
    };

    const handleMarkReady = async (videoId: string) => {
        try {
            await editorApi.markReady(videoId);
            toast.success('Video marked as ready for publishing!');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleSaveNotes = async (videoId: string) => {
        try {
            await editorApi.addNotes(videoId, editingNotes[videoId] || '');
            toast.success('Notes saved!');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save notes');
        }
    };

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    const VideoCard = ({ video, showClaim = false }: { video: any; showClaim?: boolean }) => {
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
                        src={video.url.startsWith('http') ? video.url : `${API_URL}/uploads/${video.url}`}
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-white font-semibold text-sm">{video.caption || 'No caption'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-400 text-xs">{video.user?.name || video.user?.email}</span>
                                <span className="text-zinc-700">•</span>
                                <span className="text-gray-500 text-xs">{video.platform}</span>
                            </div>
                            {video.user?.sport && (
                                <span className="text-xs text-gray-600 mt-1 block">Sport: {video.user.sport}</span>
                            )}
                        </div>
                        {/* Download Original */}
                        <a
                            href={video.url.startsWith('http') ? video.url : `${API_URL}/uploads/${video.url}`}
                            download
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Download original"
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
                            Claim This Video
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
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium py-3"
                                    variant="outline"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadingId === video.id ? 'Uploading...' : (video.editedUrl ? 'Replace Edited Video' : 'Upload Edited Video')}
                                </Button>
                                {video.editedUrl && (
                                    <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Edited version uploaded
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <Label className="text-gray-400 text-xs">Editor Notes</Label>
                                <Textarea
                                    value={editingNotes[video.id] ?? video.editorNotes ?? ''}
                                    onChange={(e) => setEditingNotes(prev => ({ ...prev, [video.id]: e.target.value }))}
                                    placeholder="Add notes about the edit..."
                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white text-xs min-h-[60px]"
                                />
                                <Button
                                    onClick={() => handleSaveNotes(video.id)}
                                    size="sm"
                                    className="mt-1 bg-zinc-700 hover:bg-zinc-600 text-xs"
                                >
                                    <FileText className="w-3 h-3 mr-1" /> Save Notes
                                </Button>
                            </div>

                            {/* Mark Ready */}
                            <Button
                                onClick={() => handleMarkReady(video.id)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-4"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark as Ready to Publish
                            </Button>
                        </div>
                    )}

                    {/* Show edited video preview */}
                    {video.editedUrl && video.status !== 'EDITING' && (
                        <div className="pt-2 border-t border-zinc-800">
                            <p className="text-gray-500 text-xs mb-1">Edited Version:</p>
                            <video
                                src={video.editedUrl.startsWith('http') ? video.editedUrl : `${API_URL}/uploads/${video.editedUrl}`}
                                className="w-full rounded-lg"
                                controls
                                preload="metadata"
                            />
                        </div>
                    )}

                    {/* Show notes read-only */}
                    {video.editorNotes && video.status !== 'EDITING' && (
                        <div className="pt-2 border-t border-zinc-800">
                            <p className="text-gray-500 text-xs">Notes: <span className="text-gray-300">{video.editorNotes}</span></p>
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
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black tracking-tight">
                            <span className="text-red-600">EDITOR</span> DASHBOARD
                        </h1>
                        <p className="text-gray-500 text-xs mt-1">Manage and edit athlete content</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <Button onClick={handleLogout} variant="outline" size="sm" className="border-zinc-700 text-gray-300 hover:text-white text-xs">
                            <LogOut className="w-4 h-4 mr-1" /> Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'In Queue', value: queue.length, color: 'text-amber-400' },
                        { label: 'My Editing', value: myVideos.filter(v => v.status === 'EDITING').length, color: 'text-blue-400' },
                        { label: 'Ready', value: myVideos.filter(v => v.status === 'READY').length, color: 'text-green-400' },
                        { label: 'Published', value: myVideos.filter(v => v.status === 'PUBLISHED').length, color: 'text-purple-400' },
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
                            {tab === 'queue' ? `📥 Video Queue (${queue.length})` : `🎬 My Work (${myVideos.length})`}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto" />
                        <p className="text-gray-500 text-sm mt-4">Loading...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 'queue' && (
                            <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {queue.length === 0 ? (
                                    <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <Video className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium">Queue is empty</p>
                                        <p className="text-gray-600 text-sm">No videos waiting for editing</p>
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
                                        <p className="text-gray-400 font-medium">No assigned videos</p>
                                        <p className="text-gray-600 text-sm">Claim videos from the queue to start editing</p>
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
