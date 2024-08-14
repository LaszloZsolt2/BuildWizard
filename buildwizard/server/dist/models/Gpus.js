"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gpus = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    chipset: { type: String, required: true },
    memory: { type: Number, required: true },
    core_clock: { type: Number, required: true },
    boost_clock: { type: Number, required: false },
    color: { type: String, required: true },
    length: { type: Number, required: true },
    benchmark: { type: Number, required: true },
});
const Gpus = mongoose_1.default.model("Gpus", gpus, "gpus");
exports.default = Gpus;
