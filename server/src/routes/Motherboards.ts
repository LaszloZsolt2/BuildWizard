import express from "express";
import Motherboards from "../models/Motherboards";
import { ComponentsType } from "../types/componentsType";
import {
  caseMotherboardCompatibility,
  socketRamSpeeds,
} from "../utils/compatibilityChecks";
import { getPartList, transformComponents } from "../utils/partData";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Motherboards.countDocuments();
    const motherboards = await Motherboards.find()
      .skip(startIndex)
      .limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: motherboards,
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

      if (components?.cpus?.socket) {
        filter.socket = { $eq: components.cpus.socket };
      } else if (components?.memories?.[0]?.speed?.[0]) {
        const memoryType = components.memories[0].speed[0];
        const sockets = Object.keys(socketRamSpeeds).filter(
          (socket) => socketRamSpeeds[socket] === memoryType
        );
        filter.socket = { $in: sockets };
      }

      if (components?.cases?.type) {
        filter.form_factor = {
          $in: caseMotherboardCompatibility[components.cases.type],
        };
      }
    }

    const total = await Motherboards.countDocuments(filter);
    const motherboards = await Motherboards.find(filter)
      .skip(startIndex)
      .limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: motherboards.map((motherboard) => motherboard.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: motherboards,
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
    const motherboard = await Motherboards.findById(req.params.id);
    if (motherboard) {
      res.json(motherboard);
    } else {
      res.status(404).json({ message: "Motherboard not found" });
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
