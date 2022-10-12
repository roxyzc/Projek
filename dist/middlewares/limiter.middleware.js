"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAccountLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.loginAccountLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Please login again after 15min' },
    standardHeaders: true,
    legacyHeaders: false
});
