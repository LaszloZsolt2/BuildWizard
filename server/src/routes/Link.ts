import express, { Request, Response } from "express";
import Links from "../models/Link";
import { getPartList } from "../utils/partData";

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
    const link = await Links.findOne({ link: req.params.id });
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    const components = {
      cpus: { _id: link.cpu },
      "cpu-coolers": { _id: link.cpu_cooler },
      gpus: { _id: link.gpu },
      cases: { _id: link.case },
      "case-fans": link.case_fans.map((id: any) => ({ _id: id })),
      "hard-drives": link.hard_drives.map((id: any) => ({ _id: id })),
      memories: link.memories.map((id: any) => ({ _id: id })),
      motherboards: { _id: link.motherboards },
      "power-supplies": { _id: link.power_supplies },
    };

    res.json(await getPartList(components));
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
      link,
    } = req.body;

    const linkData = {
      cpu,
      cpu_cooler,
      gpu,
      case: caseComponent,
      case_fans,
      hard_drives,
      memories,
      motherboards,
      power_supplies,
      link,
    };

    // delete previous links with this link
    await Links.deleteMany({ link });

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
