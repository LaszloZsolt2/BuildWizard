"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const systemRequirements = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    minimum: {
        type: new mongoose_1.default.Schema({
            cpu: { type: String, required: true },
            ram: { type: String, required: true },
            gpu: { type: Number, required: false },
            vram: { type: Number, required: false },
        }, { _id: false }),
        required: false,
    },
    recommended: {
        type: new mongoose_1.default.Schema({
            cpu: { type: String, required: true },
            ram: { type: String, required: true },
            gpu: { type: Number, required: false },
            vram: { type: Number, required: false },
        }, { _id: false }),
        required: false,
    },
    space: { type: Number, required: true },
});
const SystemRequirements = mongoose_1.default.model("SystemRequirements", systemRequirements, "system-requirements");
exports.default = SystemRequirements;
