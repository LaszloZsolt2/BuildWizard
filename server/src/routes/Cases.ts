import express from "express";
import Cases from "../models/Cases";
import { getPartList, transformComponents } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";
import {
  caseMotherboardCompatibility,
  casePowerSupplyCompatibility,
} from "../utils/compatibilityChecks";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Cases.countDocuments();
    const cases = await Cases.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cases,
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

      if (components?.["hard-drives"]) {
        const bayCount = components["hard-drives"].filter(
          (drive: any) => drive.form_factor == 3.5 || drive.form_factor == 2.5
        ).length;
        filter.internal_35_bays = { $gte: bayCount };
      }

      let caseFormFactors = Object.keys(caseMotherboardCompatibility);

      if (components?.motherboards?.form_factor) {
        caseFormFactors = caseFormFactors.filter((formFactor) =>
          caseMotherboardCompatibility[formFactor].includes(
            components.motherboards.form_factor
          )
        );
      }

      if (components?.["power-supplies"]?.type) {
        caseFormFactors = caseFormFactors.filter((formFactor) =>
          casePowerSupplyCompatibility[formFactor].includes(
            components["power-supplies"].type
          )
        );
      }

      filter.type = { $in: caseFormFactors };
    }

    const total = await Cases.countDocuments(filter);
    const cases = await Cases.find(filter).skip(startIndex).limit(searchLimit);

    if (suggestionsOnly) {
      return res.json({
        suggestions: cases.map((cases) => cases.name),
      });
    }

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cases,
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
    const caseFan = await Cases.findById(req.params.id);
    if (caseFan) {
      res.json(caseFan);
    } else {
      res.status(404).json({ message: "Case Fan not found" });
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
