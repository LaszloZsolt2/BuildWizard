import express from "express";
import Cpus from "../models/Cpus";
import { getPartList, transformComponents } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";
import { socketRamSpeeds } from "../utils/compatibilityChecks";
import { getCombinedSystemRequirements } from "../utils/benchmark";

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

    let filter = {} as any;
    if (query?.length) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (req.query.compatibilityFilter === "true") {
      const components = await getPartList(
        transformComponents(req.query.components as ComponentsType)
      );

      if (components?.["cpu-coolers"]?.tdp) {
        filter.tdp = { $lte: components["cpu-coolers"].tdp };
      }

      if (components?.motherboards?.socket) {
        filter.socket = { $eq: components.motherboards.socket };
      } else if (components?.memories?.[0]?.speed?.[0]) {
        const memoryType = components.memories[0].speed[0];
        const sockets = Object.keys(socketRamSpeeds).filter(
          (socket) =>
            socketRamSpeeds[socket as keyof typeof socketRamSpeeds] ===
            memoryType
        );

        filter.socket = { $in: sockets };
      }
    }

    if (req.query.systemRequirementsFilter !== "off" && req.query.ids) {
      const systemRequirements = await getCombinedSystemRequirements(req);
      const benchmark =
        req.query.systemRequirementsFilter === "recommended"
          ? systemRequirements?.benchmarks?.recCpuBenchmark
          : systemRequirements?.benchmarks?.minCpuBenchmark;

      if (benchmark) {
        filter.benchmark = { $gte: benchmark };
      }
    }

    const total = await Cpus.countDocuments(filter);
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
