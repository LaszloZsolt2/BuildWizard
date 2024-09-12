import express from "express";
import Cpus from "../models/Cpus";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Cpus.countDocuments();
    const cpus = await Cpus.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cpus,
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

    const total = suggestionsOnly ? await Cpus.countDocuments(filter) : 0;
    const cpus = await Cpus.find(filter).skip(startIndex).limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: cpus.map((cpu) => cpu.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cpus,
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
    const cpu = await Cpus.findById(req.params.id);
    if (cpu) {
      res.json(cpu);
    } else {
      res.status(404).json({ message: "CPU not found" });
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
