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

    updateVideoStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const response = await client.put(`/api/admin/videos/${id}/status`, { status });
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await client.get(`/api/admin/users/${id}`);
        return response.data;
    },
};
