"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import { v4 } from 'uuid';
require("dotenv/config");
const SiswaSchema = new mongoose_1.Schema({
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
        kelas: {
            type: String,
            enum: ['TI.21.A.1', 'TI.21.A.2', 'TI.21.A.3'],
            required: true
        },
        violation: [
            {
                aspek: {
                    type: String,
                    required: true
                },
                poin: {
                    type: Number,
                    required: true
                },
                deskripsi: {
                    type: String,
                    required: true
                }
            }
        ],
        amount: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('Siswa', SiswaSchema);
