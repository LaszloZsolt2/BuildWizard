import express from "express";
import MotherBoards from "../models/MotherBoards";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const motherBoards = await MotherBoards.find();
    res.json(motherBoards);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
