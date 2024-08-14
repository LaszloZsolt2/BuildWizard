"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Gpus_1 = __importDefault(require("../models/Gpus"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const gpus = await Gpus_1.default.find();
        res.json(gpus);
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
