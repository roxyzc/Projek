"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siswa_controller_1 = __importDefault(require("../controllers/siswa.controller"));
const verifyToken_middleware_1 = require("../middlewares/verifyToken.middleware");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const validationSchema_middleware_1 = require("../middlewares/validationSchema.middleware");
const route = (0, express_1.Router)();
const siswa = new siswa_controller_1.default();
route.get('/find', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyToken, siswa.findSiswa);
route.get('/findallsiswa', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyTokenAdmin, siswa.findAllSiswa);
route.post('/violation', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyTokenAdmin, (0, validationSchema_middleware_1.validateSchema)(validationSchema_middleware_1.schemas.User.violation), siswa.createViolationSiswa);
route.delete('/deletesiswa/:id', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyToken, siswa.deleteSiswa);
route.get('/stat', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyToken, siswa.findStat);
route.get('/ranksiswa', auth_middlewares_1.authLogin, verifyToken_middleware_1.verifyToken, siswa.findRank);
// route.get('/filterAlphabet', authLogin, verifyToken, siswa.filterUserAlfabet);
exports.default = route;
