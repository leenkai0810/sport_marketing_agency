import client from './client';

export const videoApi = {
    // Now accepts a JSON object with the URL instead of FormData
    uploadVideo: async (data: { url: string; caption: string; platform: string }) => {
        const response = await client.post('/api/videos/upload', data);
        return response.data;
    },

    getMyVideos: async () => {
        const response = await client.get('/api/videos/my-videos');
        return response.data;
    },
};
