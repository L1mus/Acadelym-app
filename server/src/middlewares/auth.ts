import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};