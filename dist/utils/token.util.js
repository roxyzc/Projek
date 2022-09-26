"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '1s' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '1h' });
    return Promise.resolve({ accessToken, refreshToken });
};
exports.generateAccessToken = generateAccessToken;
const refreshToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '1h' });
    return Promise.resolve({ accessToken });
};
exports.refreshToken = refreshToken;
