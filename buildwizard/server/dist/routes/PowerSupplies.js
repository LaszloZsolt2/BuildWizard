"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PowerSupplies_1 = __importDefault(require("../models/PowerSupplies"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const powerSupplies = await PowerSupplies_1.default.find();
        res.json(powerSupplies);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.default = router;
