import express from "express";
import PowerSupplies from "../models/PowerSupplies";
import { ComponentsType } from "../types/componentsType";
import {
  socketRamSpeeds,
  caseMotherboardCompatibility,
  casePowerSupplyCompatibility,
} from "../utils/compatibilityChecks";
import { getPartList, transformComponents } from "../utils/partData";
import { getPowerConsumption } from "../utils/pcBuilder";
import { PartType } from "../types/partType";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await PowerSupplies.countDocuments();
    const powerSupplies = await PowerSupplies.find()
      .skip(startIndex)
      .limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: powerSupplies,
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

      if (components?.cases?.type) {
        filter.type = {
          $in: casePowerSupplyCompatibility[components.cases.type],
        };
      }

      let powerConsumption = 0;
      for (const k in components) {
        const key = k as PartType;
        powerConsumption += getPowerConsumption(components[key], key);
      }
      filter.wattage = { $gte: powerConsumption * 1.3 };
    }

    const total = await PowerSupplies.countDocuments(filter);
    const powerSupplies = await PowerSupplies.find(filter)
      .skip(startIndex)
      .limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: powerSupplies.map((powerSupplie) => powerSupplie.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: powerSupplies,
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
    const powerSupply = await PowerSupplies.findById(req.params.id);
    if (powerSupply) {
      res.json(powerSupply);
    } else {
      res.status(404).json({ message: "PowerSupply not found" });
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
