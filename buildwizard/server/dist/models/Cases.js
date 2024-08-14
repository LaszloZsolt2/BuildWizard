"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const casesShema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    type: { type: String, required: true },
    color: { type: String, required: true },
    psu: { type: Number, required: false },
    side_panel: { type: String, required: false },
    external_volume: { type: Number, required: false },
    internal_35_bays: { type: Number, required: true },
});
const Cases = mongoose_1.default.model("Cases", casesShema, "cases");
exports.default = Cases;
