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
    check(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.sendStatus(200);
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = req.query.kelas ? yield user_model_1.default.find({ 'data.kelas': req.query.kelas }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1 }) : false;
                if (!users)
                    throw new Error('your query is required');
                return res.status(200).json({ success: true, users });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    findAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query.new;
                const users = query
                    ? yield user_model_1.default.find({}, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, 'data.password': 1 }).sort({ createdAt: -1 }).limit(Number(query))
                    : yield user_model_1.default.find({}, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1 });
                res.status(200).json({ success: true, users });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
                if (!user)
                    return res.sendStatus(400);
                if (req.User.id === req.params.id) {
                    return req.logOut((_error) => {
                        req.session.destroy((error) => {
                            if (error)
                                throw new Error(error);
                            res.status(204).end();
                        });
                    });
                }
                return res.sendStatus(200);
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, kelas } = req.body;
                const user = yield user_model_1.default.findOne({ $and: [{ _id: req.params.id }, { username }] });
                if (!user || user.role === 'admin')
                    return res.sendStatus(400);
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
                return res.sendStatus(200);
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
exports.default = User;
