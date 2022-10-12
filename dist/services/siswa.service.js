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
exports.createViolationSiswa = void 0;
const siswa_model_1 = __importDefault(require("../models/siswa.model"));
const slug_library_1 = require("../library/slug.library");
const createViolationSiswa = ({ username, kelas, aspek, poin, deskripsi }) => __awaiter(void 0, void 0, void 0, function* () {
    const siswa = yield siswa_model_1.default.findOne({ $and: [{ 'data.username': (0, slug_library_1.slug)(username) }, { 'data.kelas': kelas }] });
    if (!siswa)
        return yield siswa_model_1.default.create({ data: { username: (0, slug_library_1.slug)(username), kelas, violation: [{ aspek, poin, deskripsi }], amount: poin } });
    siswa.data.violation.push({ aspek, poin, deskripsi });
    siswa.data.amount = siswa.data.amount + poin;
    siswa.save();
    return siswa;
});
exports.createViolationSiswa = createViolationSiswa;
