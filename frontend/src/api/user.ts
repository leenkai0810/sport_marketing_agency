import client from './client';

export const userApi = {
    acceptContract: async () => {
        const response = await client.post('/api/user/accept-contract');
        return response.data;
    },

    getContractStatus: async () => {
        const response = await client.get('/api/user/contract-status');
        return response.data;
    },

    getMe: async () => {
        const response = await client.get('/api/user/me');
        return response.data;
    },
};
