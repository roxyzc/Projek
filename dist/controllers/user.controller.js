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
const user_model_1 = __importDefault(require("../models/user.model"));
const slug_library_1 = require("../library/slug.library");
class User {
    findAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = req.query.new
                    ? yield user_model_1.default.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 }).sort({ createdAt: -1 }).limit(Number(req.query.new))
                    : yield user_model_1.default.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 });
                res.status(200).json({ success: true, users });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
                if (!user)
                    return res.status(400).json({ success: false, message: 'Bad request' });
                if (req.User.id === req.params.id) {
                    return req.logOut((_error) => {
                        req.session.destroy((error) => {
                            if (error)
                                throw new Error(error);
                            res.status(204).end();
                        });
                    });
                }
                return res.status(200).json({ success: true, message: 'delete account successfully' });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, kelas } = req.body;
                const user = yield user_model_1.default.findOne({ $and: [{ _id: req.params.id }, { username }] });
                if (!user || user.role === 'admin')
                    return res.status(400).json({ success: false, message: "User not found or account can't be deleted" });
                if (password !== undefined) {
                    const valid = yield user.comparePassword(password);
                    if (valid)
                        throw new Error('Your password is the same as your old password');
                    user.data.password = password;
                }
                if (username !== undefined)
                    user.data.username = (0, slug_library_1.slug)(username);
                if (kelas !== undefined)
                    user.data.kelas = kelas;
                user.save();
                return res.status(200).json({ success: true, message: 'Update user successfully' });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
}
exports.default = User;
