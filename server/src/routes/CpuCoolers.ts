import express from "express";
import CpuCoolers from "../models/CpuCoolers";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cpuCoolers = await CpuCoolers.find();
    res.json(cpuCoolers);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
