import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

// i18n
import { i18next, middleware } from './config/i18n';
app.use(middleware.handle(i18next));

// Use JSON parser globally EXCEPT for the webhook URL
app.use((req, res, next) => {
    if (req.originalUrl === '/api/subscriptions/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Sport Marketing Agency API is running');
});

// We will add auth routes here later
import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import adminRoutes from './routes/adminRoutes';
import editorRoutes from './routes/editorRoutes';
import userRoutes from './routes/userRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/editor', editorRoutes);
app.use('/api/user', userRoutes);

export default app;
