import express from "express";
import Gpus from "../models/Gpus";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gpus = await Gpus.find();
    res.json(gpus);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
