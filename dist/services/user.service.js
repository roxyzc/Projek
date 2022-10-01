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
exports.createAdmin = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const slug_library_1 = require("../library/slug.library");
const createUser = ({ username, email, password, kelas }) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    const user = yield user_model_1.default.findOne({ 'data.email': email });
    if (!user)
        return yield user_model_1.default.create({ data: { username: (0, slug_library_1.slug)(username), email, password, kelas } });
    throw new Error('Email is already in use by another user');
    // } catch (error: any) {
    //     throw new Error(error);
    // }
});
exports.createUser = createUser;
const createAdmin = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ 'data.email': email });
    if (!user)
        return yield user_model_1.default.create({ data: { username: process.env.USERNAME_ADMIN, email, password } });
    return user;
});
exports.createAdmin = createAdmin;
