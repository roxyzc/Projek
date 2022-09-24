"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validationSchema_middleware_1 = require("../middlewares/validationSchema.middleware");
const route = (0, express_1.Router)();
const auth = new auth_controller_1.default();
route.post('/register', (0, validationSchema_middleware_1.validateSchema)(validationSchema_middleware_1.schemas.Auth.register), auth.register);
route.post('/login', (0, validationSchema_middleware_1.validateSchema)(validationSchema_middleware_1.schemas.Auth.login), auth.login);
route.delete('/logout', auth.logout);
exports.default = route;
