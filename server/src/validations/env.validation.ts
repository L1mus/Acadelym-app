import z from 'zod'

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    DB_HOST: z.string(),
    DB_PORT: z.string().transform(Number),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
    SMTP_HOST:z.string(),
    SMTP_PORT:z.string().transform(Number).default('465'),
    SMTP_USER:z.string(),
    SMTP_PASS:z.string(),
    APP_URL:z.string()
});