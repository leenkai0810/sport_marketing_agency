import client from './client';

export const editorApi = {
    getQueue: async () => {
        const response = await client.get('/api/editor/queue');
        return response.data;
    },

    getMyVideos: async () => {
        const response = await client.get('/api/editor/my-videos');
        return response.data;
    },

    assignToSelf: async (videoId: string) => {
        const response = await client.post(`/api/editor/assign/${videoId}`);
        return response.data;
    },

    uploadEdited: async (videoId: string, file: File) => {
        const formData = new FormData();
        formData.append('video', file);
        const response = await client.post(`/api/editor/upload/${videoId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    markReady: async (videoId: string) => {
        const response = await client.patch(`/api/editor/ready/${videoId}`);
        return response.data;
    },

    addNotes: async (videoId: string, notes: string) => {
        const response = await client.patch(`/api/editor/notes/${videoId}`, { notes });
        return response.data;
    },
};
