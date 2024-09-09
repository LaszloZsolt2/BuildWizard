import express, { Request, Response } from "express";
import Links from "../models/Link";
import Component from "../models/Component";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;
    const total = await Links.countDocuments();
    const links = await Links.find().skip(startIndex).limit(limit);
    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: links,
    });
  } catch (err: unknown) {
    console.error("Error fetching links:", err);
    res
      .status(500)
      .json({ message: "An unknown error occurred while fetching links." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const link = await Links.findById(req.params.id).populate([
      "cpu",
      "cpu_cooler",
      "gpu",
      "case",
      "case_fans",
      "hard_drives",
      "memories",
      "motherboards",
      "power_supplies",
    ]);
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.json(link);
  } catch (err) {
    console.error("Error fetching link:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the link" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      cpu,
      cpu_cooler,
      gpu,
      case: caseComponent,
      case_fans,
      hard_drives,
      memories,
      motherboards,
      power_supplies,
    } = req.body;

    const linkData = {
      cpu: cpu ? { _id: cpu } : null,
      cpu_cooler: cpu_cooler ? { _id: cpu_cooler } : null,
      gpu: gpu ? { _id: gpu } : null,
      case: caseComponent ? { _id: caseComponent } : null,
      case_fans: case_fans ? { _id: case_fans } : null,
      hard_drives: hard_drives ? { _id: hard_drives } : null,
      memories: memories ? { _id: memories } : null,
      motherboards: motherboards ? { _id: motherboards } : null,
      power_supplies: power_supplies ? { _id: power_supplies } : null,
    };

    const newLink = new Links(linkData);
    const savedLink = await newLink.save(); // Only call save once

    console.log("Saved link:", savedLink);
    res.status(201).json(savedLink);
  } catch (err: unknown) {
    console.error("Error saving link:", err);
    res
      .status(500)
      .json({ message: "An unknown error occurred while saving the link." });
  }
});

export default router;
