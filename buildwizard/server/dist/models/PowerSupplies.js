"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const powerSupplies = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: false },
    type: { type: String, required: true },
    effiency: { type: String, required: false },
    wattage: { type: Number, required: true },
    modular: { type: mongoose_1.default.Schema.Types.Mixed, required: false },
    color: { type: String, required: false },
});
const PowerSupplies = mongoose_1.default.model("PowerSupplies", powerSupplies, "power-supplies");
exports.default = PowerSupplies;
