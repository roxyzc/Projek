"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_session_1 = __importDefault(require("express-session"));
const sessionMiddleware = (req, res, next) => {
    return (0, express_session_1.default)({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: connect_mongo_1.default.create({
            mongoUrl: process.env.MONGODB_URL
        }),
        cookie: {
            httpOnly: true,
            // secure: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            maxAge: 60 * 60 * 1000
        }
    })(req, res, next);
};
exports.default = sessionMiddleware;
