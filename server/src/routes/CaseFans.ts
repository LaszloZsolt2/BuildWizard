import express from "express";
import CaseFan from "../models/CaseFans";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const caseFans = await CaseFan.find();
    res.json(caseFans);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
