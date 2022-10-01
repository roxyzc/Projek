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
exports.checkExpired = exports.verifyTokenAdmin = exports.verifyTokenAndAuthorization = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logging_library_1 = require("../library/logging.library");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader)
            return res.sendStatus(401);
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (err)
                return res.sendStatus(403);
            if (((_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user) !== decoded.id)
                return res.sendStatus(400);
            req.User = decoded;
            next();
        }));
    }
    catch (error) {
        logging_library_1.Logger.error(error);
        throw new Error(error);
    }
});
exports.verifyToken = verifyToken;
const verifyTokenAndAuthorization = (req, res, next) => {
    try {
        (0, exports.verifyToken)(req, res, () => {
            if (req.User.role == 'admin' || req.User.id === req.params.id)
                return next();
            return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
        });
    }
    catch (error) {
        logging_library_1.Logger.error(error);
        throw new Error(error);
    }
};
exports.verifyTokenAndAuthorization = verifyTokenAndAuthorization;
const verifyTokenAdmin = (req, res, next) => {
    try {
        (0, exports.verifyToken)(req, res, () => {
            if (req.User.role == 'admin')
                return next();
            return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
        });
    }
    catch (error) {
        logging_library_1.Logger.error(error);
        throw new Error(error);
    }
};
exports.verifyTokenAdmin = verifyTokenAdmin;
const checkExpired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader)
            return res.sendStatus(401);
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKEN_SECRET, (err, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (!err)
                return res.sendStatus(400);
            req.token = token;
            next();
        }));
    }
    catch (error) {
        logging_library_1.Logger.error(error);
        throw new Error(error);
    }
});
exports.checkExpired = checkExpired;
