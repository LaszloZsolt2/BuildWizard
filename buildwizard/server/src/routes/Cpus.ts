import express from "express";
import Cpus from "../models/Cpus";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cpus = await Cpus.find();
    res.json(cpus);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
