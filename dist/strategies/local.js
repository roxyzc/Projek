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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = __importDefault(require("../models/user.model"));
const logging_library_1 = require("../library/logging.library");
const token_util_1 = require("../utils/token.util");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ 'data.email': email });
        if (!user)
            throw new Error('User not found');
        const valid = yield user.comparePassword(password);
        if (!valid)
            throw new Error('Password not match');
        const { accessToken, refreshToken } = yield (0, token_util_1.generateAccessToken)(user);
        Object.assign(user, { token: { accessToken, refreshToken } }).save();
        done(null, user);
    }
    catch (error) {
        logging_library_1.Logger.error(error);
        done(error.message, null);
    }
})));
passport_1.default.serializeUser((user, done) => done(null, user.id));
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(id);
        return done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error, null);
    }
}));
exports.default = passport_1.default;
