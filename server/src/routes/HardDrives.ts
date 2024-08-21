import express from "express";
import HardDrives from "../models/HardDrives";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || Infinity;
    const startIndex = (page - 1) * limit;
    const total = await HardDrives.countDocuments();
    const hardDrives = await HardDrives.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: hardDrives,
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
    const hardDrive = await HardDrives.findById(req.params.id);
    if (hardDrive) {
      res.json(hardDrive);
    } else {
      res.status(404).json({ message: "Hard Drive not found" });
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
