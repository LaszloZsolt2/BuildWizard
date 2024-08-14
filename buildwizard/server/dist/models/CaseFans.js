"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const caseFanSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    rpm: { type: Number, required: false },
    airflow: { type: Number, required: false },
    noise_level: { type: Number, required: false },
    pwm: { type: Boolean, required: true },
});
const CaseFan = mongoose_1.default.model("CaseFan", caseFanSchema, "case-fans");
exports.default = CaseFan;
