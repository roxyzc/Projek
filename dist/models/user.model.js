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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { v4 } from 'uuid';
require("dotenv/config");
const UserSchema = new mongoose_1.Schema({
    // _id: {
    //     type: String,
    //     default: function () {
    //         return v4();
    //     }
    // },
    data: {
        username: {
            type: String,
            required: true,
            min: 6,
            max: 12
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 12,
            max: 24
        },
        kelas: {
            type: String,
            enum: ['TI.21.A.1', 'TI.21.A.2', 'TI.21.A.3', undefined],
            required: function () {
                return (this.data.username === process.env.USERNAME_ADMIN && this.data.password === process.env.PASSWORD_ADMIN && this.data.email === process.env.EMAIL_ADMIN) ||
                    this.role === 'admin'
                    ? false
                    : true;
            },
            default: undefined
        }
    },
    role: {
        type: String,
        enum: ['admin', 'guru'],
        default: function () {
            return this.data.username === process.env.USERNAME_ADMIN && this.data.password === process.env.PASSWORD_ADMIN && this.data.email === process.env.EMAIL_ADMIN ? 'admin' : 'guru';
        }
    },
    token: {
        accessToken: {
            type: String,
            required: false,
            default: undefined
        },
        refreshToken: {
            type: String,
            required: false,
            default: undefined
        }
    }
}, { timestamps: true, versionKey: false });
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('data.password')) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const hash = yield bcrypt_1.default.hash(this.data.password, salt);
        this.data.password = hash;
        return next();
    });
});
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return yield bcrypt_1.default.compare(candidatePassword, user.data.password).catch(() => false);
    });
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
