import express from "express";
import CpuCoolers from "../models/CpuCoolers";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await CpuCoolers.countDocuments();
    const cpuCoolers = await CpuCoolers.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cpuCoolers,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cpuCooler = await CpuCoolers.findById(req.params.id);
    if (cpuCooler) {
      res.json(cpuCooler);
    } else {
      res.status(404).json({ message: "CPU Cooler not found" });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
