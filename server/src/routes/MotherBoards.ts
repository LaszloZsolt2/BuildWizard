import express from "express";
import MotherBoards from "../models/MotherBoards";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || Infinity;
    const startIndex = (page - 1) * limit;
    const total = await MotherBoards.countDocuments();
    const motherBoards = await MotherBoards.find()
      .skip(startIndex)
      .limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: motherBoards,
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
    const motherBoard = await MotherBoards.findById(req.params.id);
    if (motherBoard) {
      res.json(motherBoard);
    } else {
      res.status(404).json({ message: "MotherBoard not found" });
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
