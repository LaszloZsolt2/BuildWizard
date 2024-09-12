import express from "express";
import Memories from "../models/Memories";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Memories.countDocuments();
    const memories = await Memories.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: memories,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toString()?.toLowerCase();
    const suggestionsOnly = req.query.suggestions === "true";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const searchLimit = suggestionsOnly ? 10 : limit;

    const filter = {
      name: { $regex: query, $options: "i" },
    };

    const total = suggestionsOnly ? await Memories.countDocuments(filter) : 0;
    const memories = await Memories.find(filter)
      .skip(startIndex)
      .limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: memories.map((memorie) => memorie.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: memories,
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
    const memory = await Memories.findById(req.params.id);
    if (memory) {
      res.json(memory);
    } else {
      res.status(404).json({ message: "Memory not found" });
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
