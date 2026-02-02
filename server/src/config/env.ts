import dotenv from 'dotenv';
import {envSchema} from "../validations/env.validation.js";

dotenv.config();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;