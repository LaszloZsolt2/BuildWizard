import express from "express";
import Memories from "../models/Memories";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const memories = await Memories.find();
    res.json(memories);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
