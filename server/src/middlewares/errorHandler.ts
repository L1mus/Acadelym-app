import {Request, Response, NextFunction} from 'express';
import {ZodError} from 'zod';
import {AppError} from "../utils/AppError.js";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "an error occurred "
    if (err instanceof ZodError){
        statusCode = 400;
        message="Bad Request"
    }

    if(err.code === '23505'){
        statusCode = '409'
        message ="Data has been registered (Duplicate Entry)"
    }

    if(err instanceof AppError){

    }

    if (statusCode === 500){
        console.log("CRITICAL ERROR", err)
    }

    res.status(statusCode).json({
        success : false,
        message : message,
        stack : process.env.NODE_ENV ==='development' ? err.stack : 'Access denied'
    })
};

export const notFound = (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
};