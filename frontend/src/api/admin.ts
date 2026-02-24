import client from './client';

export const adminApi = {
    getAllUsers: async () => {
        const response = await client.get('/api/admin/users');
        return response.data;
    },

    getAllVideos: async () => {
        const response = await client.get('/api/admin/videos');
        return response.data;
    },

    updateVideoStatus: async (id: string, status: string) => {
        const response = await client.put(`/api/admin/videos/${id}/status`, { status });
        return response.data;
    },

    assignEditor: async (videoId: string, editorId: string) => {
        const response = await client.put(`/api/admin/videos/${videoId}/assign`, { editorId });
        return response.data;
    },

    updateUserRole: async (userId: string, role: string) => {
        const response = await client.put(`/api/admin/users/${userId}/role`, { role });
        return response.data;
    },

    getEditors: async () => {
        const response = await client.get('/api/admin/editors');
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await client.get(`/api/admin/users/${id}`);
        return response.data;
    },
};
