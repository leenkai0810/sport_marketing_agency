import client from './client';

export const videoApi = {
    uploadVideo: async (data: { file: File; caption: string; platform: string }) => {
        const formData = new FormData();
        formData.append('video', data.file);
        formData.append('caption', data.caption);
        formData.append('platform', data.platform);
        const response = await client.post('/api/videos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getMyVideos: async () => {
        const response = await client.get('/api/videos/my-videos');
        return response.data;
    },
};
