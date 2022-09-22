"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const app = (0, express_1.default)();
app.get("/", (req, _res) => {
    req.user = {
        nama: "roxyzc", umur: 12
    };
    console.log(req.user);
});
app.listen(process.env.PORT, () => {
    console.log(`Listen at port ${process.env.PORT} in mode: ${process.env.NODE_ENV}`);
});
