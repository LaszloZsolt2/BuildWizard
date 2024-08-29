import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import caseFanRouter from "./routes/CaseFans";
import caseRouter from "./routes/Cases";
import cpuCoolersRouter from "./routes/CpuCoolers";
import cpuRouter from "./routes/Cpus";
import gpuRouter from "./routes/Gpus";
import hardDrivesRouter from "./routes/HardDrives";
import memoriesRouter from "./routes/Memories";
import motherBoardRouter from "./routes/Motherboards";
import powerSuppliesRouter from "./routes/PowerSupplies";
import systemRequirementRouter from "./routes/SystemRequirements";
import compatibilityRouter from "./routes/Compatibility";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/default";

app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error occurred while connecting to MongoDB:", err);
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
  res.send("MongoDB connection successful!");
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
app.use("/api/compatibility", compatibilityRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
