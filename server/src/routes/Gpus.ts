import express from "express";
import Gpus from "../models/Gpus";
import { getCombinedSystemRequirements } from "../utils/benchmark";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Gpus.countDocuments();
    const gpus = await Gpus.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: gpus,
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

    let filter = {} as any;
    if (query?.length) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { chipset: { $regex: query, $options: "i" } },
        ],
      };
    }

    if (req.query.systemRequirementsFilter !== "off" && req.query.ids) {
      const systemRequirements = await getCombinedSystemRequirements(req);
      const benchmark =
        req.query.systemRequirementsFilter === "recommended"
          ? systemRequirements?.benchmarks?.recGpuBenchmark
          : systemRequirements?.benchmarks?.minGpuBenchmark;

      const vram =
        req.query.systemRequirementsFilter === "recommended"
          ? systemRequirements?.systemRequirement?.recommended?.vram
          : systemRequirements?.systemRequirement?.minimum?.vram;

      if (benchmark) {
        filter.benchmark = { $gte: benchmark };
      }

      if (vram) {
        filter.memory = { $gte: vram };
      }
    }

    const total = await Gpus.countDocuments(filter);
    const gpus = await Gpus.find(filter).skip(startIndex).limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: gpus.map((gpu) => gpu.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: gpus,
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
    const gpu = await Gpus.findById(req.params.id);
    if (gpu) {
      res.json(gpu);
    } else {
      res.status(404).json({ message: "GPU not found" });
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
