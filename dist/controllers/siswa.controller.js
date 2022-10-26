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
const siswa_model_1 = __importDefault(require("../models/siswa.model"));
const siswa_service_1 = require("../services/siswa.service");
const siswa_model_2 = __importDefault(require("../models/siswa.model"));
class Siswa {
    createViolationSiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, siswa_service_1.createViolationSiswa)(req.body);
                res.status(200).json({ success: true, message: 'succeeded in violating the student', user });
            }
            catch (error) {
                logging_library_1.Logger.error(error.message);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    findSiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(req.User.id);
                if (!user)
                    throw new Error('User not found');
                const users = user.data.kelas
                    ? yield siswa_model_1.default.find({ 'data.kelas': user.data.kelas }, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ updatedAt: -1 }).limit(10)
                    : false;
                if (!users)
                    throw new Error("you can't access this");
                res.status(200).json({ success: true, users });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    // public async filterUserAlfabet(_req: Request, res: Response) {
    //     try {
    //         const users = await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ 'data.username': -1 }).limit(10);
    //         res.status(200).json({ success: true, users });
    //     } catch (error: any) {
    //         Logger.error(error);
    //         res.status(500).json({ success: false, message: error.message });
    //     }
    // }
    findAllSiswa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { querynew, alfabet } = req.query;
                if (((querynew !== undefined || null) && (alfabet !== undefined || null)) || (!querynew && (alfabet !== undefined || null))) {
                    const siswa = !querynew
                        ? yield siswa_model_1.default.find({ 'data.username': { $regex: alfabet, $options: 'i' } }, { 'data.username': 1, 'data.kelas': 1, 'data.amount': 1, _id: 0 }).sort({
                            'data.username': 1
                        })
                        : yield siswa_model_1.default.find({ 'data.username': { $regex: alfabet, $options: 'i' } }, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1, _id: 0 })
                            .sort({ 'data.username': 1 })
                            .limit(Number(querynew));
                    return res.status(200).json({ success: true, siswa });
                }
                const siswa = querynew
                    ? yield siswa_model_1.default.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ createdAt: -1 }).limit(Number(querynew))
                    : yield siswa_model_1.default.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 });
                return res.status(200).json({ success: true, siswa });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                return res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    deleteSiswa(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById((_a = req.session.passport) === null || _a === void 0 ? void 0 : _a.user);
                if (!user)
                    return res.status(404).json({ success: false, message: 'User not found' });
                const siswa = yield siswa_model_1.default.findById(req.params.id);
                if (!siswa)
                    return res.status(400).json({ success: false, message: 'Siswa not found' });
                if ((user === null || user === void 0 ? void 0 : user.data.kelas) !== (siswa === null || siswa === void 0 ? void 0 : siswa.data.kelas) && user.role !== 'admin')
                    return res.status(400).json({ success: false, message: "you can't access this" });
                yield (siswa === null || siswa === void 0 ? void 0 : siswa.delete());
                return res.status(200).json({ success: true, message: 'delete siswa successfully' });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    findStat(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const siswa = yield siswa_model_1.default.find({
                    createdAt: {
                        $lt: new Date(),
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }, { 'data.username': 1, 'data.kelas': 1, 'data.amount': 1, 'data.violation': 1, createdAt: 1, _id: 0 });
                res.status(200).json({ success: true, siswa });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    findRank(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const siswa = yield siswa_model_2.default.find({}, { 'data.username': 1, 'data.amount': 1, 'data.violation': 1, _id: 0 }).sort({ 'data.amount': -1 }).limit(10);
                res.status(200).json({ success: true, siswa });
            }
            catch (error) {
                logging_library_1.Logger.error(error);
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
}
exports.default = Siswa;
