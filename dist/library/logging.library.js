"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = require("winston");
exports.Logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console({})],
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.ms(), winston_1.format.printf(({ timestamp, message, level, ms }) => {
        return `[${timestamp}] - ${ms} ${level}: ${message} `;
    }))
});
