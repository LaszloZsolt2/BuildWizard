import express from "express";
import Cases from "../models/Cases";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cases = await Cases.find();
    res.json(cases);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
