"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const http_errors_1 = require("http-errors");
const notFound = (_req, _res, next) => {
    next(new http_errors_1.NotFound());
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    res.status(err.status || 500).json({ success: false, message: err.message });
};
exports.errorHandler = errorHandler;
