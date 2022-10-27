'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.checkToken = exports.refreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const generateAccessToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '5m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '20m' });
    return Promise.resolve({ accessToken, refreshToken });
};
exports.generateAccessToken = generateAccessToken;
const refreshToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '5m' });
    return Promise.resolve({ accessToken });
};
exports.refreshToken = refreshToken;
const checkToken = (accessToken, refreshToken) => {
    if (accessToken === undefined && refreshToken === undefined) return true;
    const valid = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESSTOKEN_SECRET, (error, _decoded) => {
        if (!error) return false;
        return jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESHTOKEN_SECRET, (error, _decoded) => {
            if (!error) return false;
            return true;
        });
    });
    return valid;
};
exports.checkToken = checkToken;
