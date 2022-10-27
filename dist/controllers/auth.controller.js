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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_library_1 = require("../library/logging.library");
const user_service_1 = require("../services/user.service");
const passport_1 = __importDefault(require("passport"));
class Auth {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, user_service_1.createUser)(req.body);
                res.status(200).json({ success: true, message: 'account created successfully', user });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                passport_1.default.authenticate('local', (error, user, _info) => __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        return res.status(400).json({ success: false, message: error });
                    req.login(user, (error) => {
                        if (error)
                            throw new Error(error);
                        res.cookie('login', true, { maxAge: 360000 });
                        const _a = user._doc, _b = _a.data, { password } = _b, others = __rest(_b, ["password"]), { role, _id } = _a, token = __rest(_a.token, []);
                        return res.status(200).json({ success: true, message: 'Login successfully', user: others, _id, role, token });
                    });
                }))(req, res, next);
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.logOut((_error) => {
                    // const user = await findUser(req.User.id);
                    // console.log(user);
                    // Object.assign(user, { token: { accessToken: undefined, refreshToken: undefined } }).save();
                    req.session.destroy((error) => {
                        if (error)
                            throw new Error(error);
                        res.clearCookie('login');
                        // req.sessionStore.destroy(req.sessionID);
                        return res.status(204).end();
                    });
                });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error });
            }
        });
    }
}
exports.default = Auth;
