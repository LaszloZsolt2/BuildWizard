"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const CaseFans_1 = __importDefault(require("./routes/CaseFans"));
const Cases_1 = __importDefault(require("./routes/Cases"));
const CpuCoolers_1 = __importDefault(require("./routes/CpuCoolers"));
const Cpus_1 = __importDefault(require("./routes/Cpus"));
const Gpus_1 = __importDefault(require("./routes/Gpus"));
const HardDrives_1 = __importDefault(require("./routes/HardDrives"));
const Memories_1 = __importDefault(require("./routes/Memories"));
const MotherBoards_1 = __importDefault(require("./routes/MotherBoards"));
const CaseFans_2 = __importDefault(require("./routes/CaseFans"));
const SystemRequirements_1 = __importDefault(require("./routes/SystemRequirements"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
mongoose_1.default
    .connect("mongodb://192.168.2.4:27017/json")
    .then(() => {
    console.log("Sikeresen csatlakozva a MongoDB-hez");
})
    .catch((err) => {
    console.error("Hiba történt a MongoDB-hez való csatlakozás során:", err);
});
const db = mongoose_1.default.connection;
db.on("connected", () => {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
    console.log(`Database name: ${db.name}`);
});
db.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
app.get("/", (req, res) => {
    res.send("MongoDB kapcsolat sikeres!");
});
app.use("/api/case-fans", CaseFans_1.default);
app.use("/api/cases", Cases_1.default);
app.use("/api/cpu-coolers", CpuCoolers_1.default);
app.use("/api/cpus", Cpus_1.default);
app.use("/api/gpus", Gpus_1.default);
app.use("/api/hard-drives", HardDrives_1.default);
app.use("/api/memories", Memories_1.default);
app.use("/api/motherboards", MotherBoards_1.default);
app.use("/api/power-supplies", CaseFans_2.default);
app.use("/api/system-requirements", SystemRequirements_1.default);
app.listen(PORT, () => {
    console.log(`A szerver a ${PORT} porton fut.`);
});
