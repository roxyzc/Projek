import { rateLimit } from 'express-rate-limit';

export const loginAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, message: 'Please login again after 15min' },
    standardHeaders: true,
    legacyHeaders: false
});
