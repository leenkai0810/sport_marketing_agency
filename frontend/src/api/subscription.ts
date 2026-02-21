import client from './client';

export const subscriptionApi = {
    createCheckoutSession: async () => {
        const response = await client.post('/api/subscriptions/create-checkout-session');
        return response.data;
    },
    verifySession: async (sessionId: string) => {
        const response = await client.post('/api/subscriptions/verify-session', { sessionId });
        return response.data;
    },
};
