import express from "express";
import SystemRequirements from "../models/SystemRequirements";
import {
  BenchmarkedSystemRequirement,
  combineSystemRequirements,
  getSystemRequirementBenchmarks,
} from "../utils/benchmark";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await SystemRequirements.countDocuments();
    const systemRequirements = await SystemRequirements.find()
      .skip(startIndex)
      .limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: systemRequirements,
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
    const systemRequirement = await SystemRequirements.findById(req.params.id);
    if (systemRequirement) {
      res.json(systemRequirement);
    } else {
      res.status(404).json({ message: "SystemRequirement not found" });
    }
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
    const query = req.query.q?.toString().toLowerCase();
    const systemRequirements = await SystemRequirements.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(systemRequirements);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

router.get("/combined", async (req, res) => {
  try {
    let combinedSystemRequirements: BenchmarkedSystemRequirement | undefined;
    for (const id of req.query.ids as string[]) {
      const systemRequirement = await SystemRequirements.findById(id);
      if (systemRequirement) {
        const benchmarks =
          await getSystemRequirementBenchmarks(systemRequirement);
        combinedSystemRequirements = combineSystemRequirements(
          { systemRequirement, benchmarks },
          combinedSystemRequirements
        );
      }
    }
    res.json(combinedSystemRequirements);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
