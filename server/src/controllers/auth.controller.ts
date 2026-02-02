import { Request, Response, NextFunction } from 'express';
import {loginService, registerService} from "../services/auth.service.js";
import {UserEntity} from "../models/users.model.js";
import {ResponseUserDTO} from "../types/user.type.js";
import {loginSchema, registerSchema, UserPayload} from "../validations/auth.validation.js";
import {LoginRequestDTO} from "../validations/auth.validation.js";
import {AppError} from "../utils/AppError.js";
import {verifyEmailService} from "../services/userVerification.service.js";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";

const toResponseDTO = (user: UserEntity): ResponseUserDTO => {
    const { id,password,country_id,profile_picture_url,created_at,updated_at,deleted_at,role,email_verified_at,verification_status, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationResult = registerSchema.safeParse({ body: req.body });

        if (!validationResult.success) {
            res.status(400).json({
                status: "fail",
                message: "Validation Failed",
                errors: validationResult.error.format(),
            });
            return;
        }

        const userData: UserPayload = validationResult.data.body;

        const newUser = await registerService(userData);
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


export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            throw new AppError(400, "Token is required");
        }

        await verifyEmailService(token);

        res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now login."
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const JWT_SECRET = env.JWT_SECRET;

        const validationResult = loginSchema.safeParse({body: req.body});

        if (!validationResult.success) {
            res.status(400).json({
                status: "fail",
                message: "Validation Failed",
                errors: validationResult.error.format(),
            });
            return;
        }

        const userData : LoginRequestDTO = validationResult.data;
        console.log(userData)

        const userEntity = await loginService(userData);

        const userResponse = toResponseDTO(userEntity);

        const token = jwt.sign(
            {
                id: userEntity.id,
                email: userEntity.email,
                role: userEntity.role
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userResponse,
                token: token,
            }
        });
    } catch (error) {
        next(error);
    }
};