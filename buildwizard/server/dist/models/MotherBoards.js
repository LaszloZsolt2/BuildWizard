"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const motherBoards = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    socket: { type: String, required: true },
    form_factor: { type: String, required: true },
    max_memory: { type: Number, required: true },
    memory_slots: { type: Number, required: true },
    color: { type: String, required: true },
});
const MotherBoards = mongoose_1.default.model("MotherBoards", motherBoards, "motherboards");
exports.default = MotherBoards;
