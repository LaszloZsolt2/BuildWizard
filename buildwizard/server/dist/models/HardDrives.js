"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hardDrives = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    capacity: { type: Number, required: true },
    price_per_gb: { type: Number, required: true },
    type: { type: mongoose_1.default.Schema.Types.Mixed, required: false },
    cache: { type: Number, required: false },
    form_factor: { type: mongoose_1.default.Schema.Types.Mixed, required: false },
    interface: { type: String, required: true },
});
const HardDrives = mongoose_1.default.model("HardDrives", hardDrives, "hard-drives");
exports.default = HardDrives;
