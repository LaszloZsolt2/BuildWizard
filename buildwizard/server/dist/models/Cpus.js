"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cpus = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    core_count: { type: Number, required: true },
    core_clock: { type: Number, required: true },
    boost_clock: { type: Number, required: true },
    tdp: { type: Number, required: true },
    graphics: { type: String, required: false },
    smt: { type: Boolean, required: true },
    benchmark: { type: Number, required: true },
    socket: { type: String, required: true },
});
const Cpus = mongoose_1.default.model("Cpus", cpus, "cpus");
exports.default = Cpus;
