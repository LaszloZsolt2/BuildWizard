import express from "express";
import mongoose from "mongoose";

import caseFanRouter from "./routes/CaseFans";
import caseRouter from "./routes/Cases";
import cpuCoolersRouter from "./routes/CpuCoolers";
import cpuRouter from "./routes/Cpus";
import gpuRouter from "./routes/Gpus";
import hardDrivesRouter from "./routes/HardDrives";
import memoriesRouter from "./routes/Memories";
import motherBoardRouter from "./routes/MotherBoards";
import powerSuppliesRouter from "./routes/CaseFans";
import systemRequirementRouter from "./routes/SystemRequirements";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect("mongodb://192.168.2.4:27017/json")
  .then(() => {
    console.log("Sikeresen csatlakozva a MongoDB-hez");
  })
  .catch((err) => {
    console.error("Hiba történt a MongoDB-hez való csatlakozás során:", err);
  });
const db = mongoose.connection;

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

app.use("/api/case-fans", caseFanRouter);
app.use("/api/cases", caseRouter);
app.use("/api/cpu-coolers", cpuCoolersRouter);
app.use("/api/cpus", cpuRouter);
app.use("/api/gpus", gpuRouter);
app.use("/api/hard-drives", hardDrivesRouter);
app.use("/api/memories", memoriesRouter);
app.use("/api/motherboards", motherBoardRouter);
app.use("/api/power-supplies", powerSuppliesRouter);
app.use("/api/system-requirements", systemRequirementRouter);

app.listen(PORT, () => {
  console.log(`A szerver a ${PORT} porton fut.`);
});
