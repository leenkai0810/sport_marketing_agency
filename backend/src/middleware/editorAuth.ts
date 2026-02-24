import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Middleware: allows EDITOR and ADMIN roles
export const editorAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (role === 'EDITOR' || role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ message: (req as any).t?.('admin.unauthorized') || 'Editor access required' });
};
