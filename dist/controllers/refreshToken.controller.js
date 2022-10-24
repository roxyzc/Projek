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
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_util_1 = require("../utils/token.util");
const logging_library_1 = require("../library/logging.library");
class Token {
    constructor() {
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ 'token.accessToken': req.token });
                if (!user)
                    return res.status(400).json({ success: false, message: 'your token is wrong' });
                jsonwebtoken_1.default.verify(user.token.refreshToken, process.env.REFRESHTOKEN_SECRET, (error, _decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        const { accessToken, refreshToken } = yield (0, token_util_1.generateAccessToken)(user);
                        Object.assign(user, { token: { accessToken, refreshToken } }).save();
                        return res.status(200).json({ success: true, accessToken, refreshToken });
                    }
                    const { accessToken } = yield (0, token_util_1.refreshToken)(user);
                    user.token.accessToken = accessToken;
                    user.save();
                    return res.status(200).json({ success: true, accessToken });
                }));
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
}
exports.default = Token;
