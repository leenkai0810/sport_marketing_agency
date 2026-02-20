import axios from 'axios';
import { getAPIBaseURL } from '../lib/config';

const client = axios.create({
    baseURL: getAPIBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

import i18n from '../i18n';

// Add a request interceptor to include the auth token and active language
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Pass the user's selected language to the backend
        config.headers['Accept-Language'] = i18n.language || 'es';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
