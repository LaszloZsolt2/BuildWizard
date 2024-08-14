import express from "express";
import SystemRequirements from "../models/SystemRequirements";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const systemRequirements = await SystemRequirements.find();
    res.json(systemRequirements);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
