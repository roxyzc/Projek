"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const refreshToken_controller_1 = __importDefault(require("../controllers/refreshToken.controller"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const route = (0, express_1.Router)();
const user = new user_controller_1.default();
const token = new refreshToken_controller_1.default();
route.get('/check', verifyToken_middleware_1.verifyToken, user.check);
route.get('/refreshToken', verifyToken_middleware_1.checkExpired, token.refreshToken);
exports.default = route;
