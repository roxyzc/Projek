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
                res.status(500).json({ success: false, error });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                passport_1.default.authenticate('local', (error, user, _info) => __awaiter(this, void 0, void 0, function* () {
                    if (error)
                        return res.status(400).json({ success: false, error });
                    req.login(user, (error) => {
                        if (error)
                            throw new Error(error);
                        return res.status(200).json({ success: true, message: 'Login successfully', user });
                    });
                }))(req, res, next);
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.logOut((error) => {
                    if (error)
                        throw new Error(error);
                    req.session.destroy((error) => {
                        if (error)
                            throw new Error(error);
                        return res.status(204).end();
                    });
                });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
}
exports.default = Auth;
