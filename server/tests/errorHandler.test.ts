import request from 'supertest';
import express from 'express';
import type { Request, Response, NextFunction, Application } from 'express';
import { z } from 'zod';
import { errorHandler, notFound } from '../src/middlewares/errorHandler';
import { AppError } from "../src/utils/AppError";

describe('Error Handler Middleware', () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
    });

    describe('AppError - Custom Error', () => {
        it('should handle AppError with correct status code', async () => {
            app.get('/test-app-error', (req: Request, res: Response, next: NextFunction) => {
                next(new AppError(400, 'Bad request error'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-app-error');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Bad request error'
            });
        });

        it('should handle AppError 404 Not Found', async () => {
            app.get('/test-not-found', (req: Request, res: Response, next: NextFunction) => {
                next(new AppError(404, 'Resource not found'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-not-found');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'Resource not found'
            });
        });

        it('should handle AppError 403 Forbidden', async () => {
            app.get('/test-forbidden', (req: Request, res: Response, next: NextFunction) => {
                next(new AppError(403, 'Access denied'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-forbidden');

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Access denied');
        });
    });

    describe('Zod Validation Error', () => {
        it('should handle Zod validation errors with field details', async () => {
            const schema = z.object({
                email: z.string().email(),
                age: z.number().min(18),
            });

            app.post('/test-validation', (req: Request, res: Response, next: NextFunction) => {
                try {
                    schema.parse(req.body);
                    res.json({ success: true });
                } catch (error) {
                    next(error);
                }
            });
            app.use(errorHandler);

            const response = await request(app)
                .post('/test-validation')
                .send({ email: 'invalid-email', age: 15 });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation error');
            expect(response.body.details).toBeInstanceOf(Array);
            expect(response.body.details.length).toBeGreaterThan(0);
            expect(response.body.details[0]).toHaveProperty('field');
            expect(response.body.details[0]).toHaveProperty('message');
        });

        it('should handle missing required fields', async () => {
            const schema = z.object({
                username: z.string(),
                password: z.string(),
            });

            app.post('/test-required', (req: Request, res: Response, next: NextFunction) => {
                try {
                    schema.parse(req.body);
                    res.json({ success: true });
                } catch (error) {
                    next(error);
                }
            });
            app.use(errorHandler);

            const response = await request(app)
                .post('/test-required')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation error');
            expect(response.body.details.length).toBe(2);
        });
    });

    describe('Generic Server Error', () => {
        it('should handle generic errors with 500 status', async () => {
            app.get('/test-server-error', (req: Request, res: Response, next: NextFunction) => {
                next(new Error('Something went wrong'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-server-error');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });

        it('should hide error details in production', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            app.get('/test-prod-error', (req: Request, res: Response, next: NextFunction) => {
                next(new Error('Sensitive error message'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-prod-error');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Internal server error');
            expect(response.body.error).not.toContain('Sensitive');

            process.env.NODE_ENV = originalEnv;
        });

        it('should show error details in development', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            app.get('/test-dev-error', (req: Request, res: Response, next: NextFunction) => {
                next(new Error('Detailed error message'));
            });
            app.use(errorHandler);

            const response = await request(app).get('/test-dev-error');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Detailed error message');

            process.env.NODE_ENV = originalEnv;
        });
    });

    describe('Not Found Handler', () => {
        it('should return 404 for undefined routes', async () => {
            app.use(notFound);

            const response = await request(app).get('/non-existent-route');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'Route not found'
            });
        });

        it('should handle POST requests to non-existent routes', async () => {
            app.use(notFound);

            const response = await request(app)
                .post('/does-not-exist')
                .send({ data: 'test' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Route not found');
        });
    });

    describe('Error Chain', () => {
        it('should pass through multiple error handlers', async () => {
            const errorLogger = jest.fn((err: Error, req: Request, res: Response, next: NextFunction) => {
                next(err);
            });

            app.get('/test-chain', (req: Request, res: Response, next: NextFunction) => {
                next(new AppError(401, 'Unauthorized'));
            });
            app.use(errorLogger);
            app.use(errorHandler);

            const response = await request(app).get('/test-chain');

            expect(errorLogger).toHaveBeenCalled();
            expect(response.status).toBe(401);
        });
    });
});