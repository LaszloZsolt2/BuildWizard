"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// MongoDB kapcsolat beállítása
mongoose_1.default
    .connect("mongodb://192.168.2.4:27017/Projekt", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
})
    .then(() => {
    console.log("Sikeresen csatlakozva a MongoDB-hez");
})
    .catch((err) => {
    console.error("Hiba történt a MongoDB-hez való csatlakozás során:", err);
});
// Alapértelmezett route a kapcsolat ellenőrzésére
app.get("/", (req, res) => {
    res.send("MongoDB kapcsolat sikeres!");
});
app.listen(PORT, () => {
    console.log(`A szerver a ${PORT} porton fut.`);
});
