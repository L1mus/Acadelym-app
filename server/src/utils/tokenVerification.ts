import crypto from 'crypto';

export const tokenVerification = crypto.randomBytes(32).toString('hex');
export const expiresAt = new Date(Date.now() + 3600000);
