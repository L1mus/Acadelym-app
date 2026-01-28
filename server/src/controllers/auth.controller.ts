import { Request, Response, NextFunction } from 'express';
import { registerService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await registerService(req.body);
        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification.",
            data: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implementasi Login Service nanti
        res.status(200).json({ message: "Login feature coming soon" });
    } catch (error) {
        next(error);
    }
};