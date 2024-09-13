import express from "express";
import Memories from "../models/Memories";
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

    let filter = {} as any;
    if (query?.length) {
      filter = {
        name: { $regex: query, $options: "i" },
      };
    }

    if (req.query.compatibilityFilter === "true") {
      const components = await getPartList(
        transformComponents(req.query.components as ComponentsType)
      );

      const socket =
        components?.cpus?.socket || components?.motherboards?.socket;
      if (socket) {
        const ramSpeed = socketRamSpeeds[socket];
        if (ramSpeed) {
          filter["speed.0"] = ramSpeed;
        }
      }
    }

    const total = await Memories.countDocuments(filter);
    const memories = await Memories.find(filter)
      .skip(startIndex)
      .limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: memories.map((memory) => memory.name),
      });
    }

    if (req.query.systemRequirementsFilter !== "off" && req.query.ids) {
      const systemRequirements = await getCombinedSystemRequirements(req);
      const ram =
        req.query.systemRequirementsFilter === "recommended"
          ? systemRequirements?.systemRequirement?.recommended?.ram
          : systemRequirements?.systemRequirement?.minimum?.ram;
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
