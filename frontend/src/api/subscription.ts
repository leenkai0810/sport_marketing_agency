import client from './client';

export const subscriptionApi = {
    createCheckoutSession: async (plan: string = 'starter') => {
        const response = await client.post('/api/subscriptions/create-checkout-session', { plan });
        return response.data;
    },
    verifySession: async (sessionId: string) => {
        const response = await client.post('/api/subscriptions/verify-session', { sessionId });
        return response.data;
    },
};
