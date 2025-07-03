import express from "express";
import CpuCoolers from "../models/CpuCoolers";
import { getPartList, transformComponents } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await CpuCoolers.countDocuments();
    const cpuCoolers = await CpuCoolers.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cpuCoolers,
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

      if (components?.cpus?.tdp) {
        filter.tdp = { $gte: components.cpus.tdp };
      }
    }

    const total = await CpuCoolers.countDocuments(filter);
    const cpuCoolers = await CpuCoolers.find(filter)
      .skip(startIndex)
      .limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: cpuCoolers.map((cpuCooler) => cpuCooler.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cpuCoolers,
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
    const cpuCooler = await CpuCoolers.findById(req.params.id);
    if (cpuCooler) {
      res.json(cpuCooler);
    } else {
      res.status(404).json({ message: "CPU Cooler not found" });
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
