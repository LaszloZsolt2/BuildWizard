import express from "express";
import { getPartList } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";
import {
  checkCaseMotherboardCompatibility,
  checkCasePowerSupplyCompatibility,
  checkCaseStorageCompatibility,
  checkCpuMotherboardCompatibility,
  checkMemoryCompatibility,
  checkMotherboardMemoryCompatibility,
  hasAllNecessaryParts,
} from "../utils/compatibilityChecks";

const router = express.Router();

export type CompatibilityMessage = {
  message: string;
  severity: "error" | "warn" | "success";
};

router.get("/", async (req, res) => {
  try {
    const components = await getPartList(
      req.query.components as ComponentsType
    );

    if (!components || !Object.keys(components).length) {
      return;
    }

    let messages: CompatibilityMessage[] = [];
    hasAllNecessaryParts(components, messages);
    checkCpuMotherboardCompatibility(components, messages);
    checkMotherboardMemoryCompatibility(components, messages);
    checkMemoryCompatibility(components, messages);
    checkCaseMotherboardCompatibility(components, messages);
    checkCasePowerSupplyCompatibility(components, messages);
    checkCaseStorageCompatibility(components, messages);

    if (!messages.length) {
      messages.push({
        message: "All of your parts are compatible",
        severity: "success",
      });
    }

    res.json({ messages });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
