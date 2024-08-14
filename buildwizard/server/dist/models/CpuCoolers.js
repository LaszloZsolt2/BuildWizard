"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cpuCoolers = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    rpm: { type: Number, required: true },
    noise_level: { type: Number, required: true },
    size: { type: Number, required: false },
});
const CpuCoolers = mongoose_1.default.model("CpuCoolers", cpuCoolers, "cpu-coolers");
exports.default = CpuCoolers;
