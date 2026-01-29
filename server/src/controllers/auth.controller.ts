import { Request, Response, NextFunction } from 'express';
import { registerService } from "../services/auth.service.js";
import {UserEntity} from "../models/users.model.js";
import {ResponseUserDTO} from "../types/user.type.js";
import {RegisterRequestDTO} from "../validations/auth.validation.js";

const toResponseDTO = (user: UserEntity): ResponseUserDTO => {
    const { id,password,country_id,profile_picture_url,created_at,updated_at,deleted_at,role,email_verified_at,verification_status, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body : RegisterRequestDTO = req.body
        const newUser = await registerService(body);
        const user = toResponseDTO(newUser);
        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification.",
            data: user
        });
    } catch (error) {
        console.log(error);
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