"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const refreshToken_controller_1 = __importDefault(require("../controllers/refreshToken.controller"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const route = (0, express_1.Router)();
const user = new user_controller_1.default();
const token = new refreshToken_controller_1.default();
route.get('/check', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyToken, user.check);
route.get('/refreshToken', auth_middlewares_1.authLogin, verifyToken_middleware_1.checkExpired, token.refreshToken);
route.delete('/delete/:id', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyTokenAndAuthorization, user.deleteUser);
// route.put('/update/:id', verifyTokenAndAuthorization, user.updateUser);
exports.default = route;
