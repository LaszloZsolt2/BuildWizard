import express from "express";
import HardDrives from "../models/HardDrives";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hardDrives = await HardDrives.find();
    res.json(hardDrives);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
