"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const memories = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    speed: { type: Number, required: true },
    modules: { type: Number, required: true },
    price_per_gb: { type: Number, required: false },
    color: { type: String, required: true },
    first_word_latency: { type: Number, required: true },
    cas_latency: { type: Number, required: true },
});
const Memories = mongoose_1.default.model("Memories", memories, "memories");
exports.default = Memories;
