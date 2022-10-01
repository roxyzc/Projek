"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.refreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '1h' });
    return Promise.resolve({ accessToken, refreshToken });
};
exports.generateAccessToken = generateAccessToken;
const refreshToken = ({ _id, role }) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '1h' });
    return Promise.resolve({ accessToken });
};
exports.refreshToken = refreshToken;
const checkToken = (accessToken, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (accessToken === undefined && refreshToken === undefined)
        return true;
    return jsonwebtoken_1.default.verify(accessToken, process.env.ACCESSTOKEN_SECRET, (error, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (!error)
            return false;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESHTOKEN_SECRET, (error, _decoded) => {
            if (!error)
                return false;
            return true;
        });
    }));
});
exports.checkToken = checkToken;
