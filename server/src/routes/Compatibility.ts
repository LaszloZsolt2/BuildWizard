import express from "express";
import { getPartList } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";
import {
  checkBottleneck,
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

    let messages: CompatibilityMessage[] = [];

    if (!components || !Object.keys(components).length) {
      messages.push({
        message: "You have no parts selected",
        severity: "warn",
      });
      res.json({ messages });
      return;
    }

    messages.push(...hasAllNecessaryParts(components));
    messages.push(...checkCpuMotherboardCompatibility(components));
    messages.push(...checkMotherboardMemoryCompatibility(components));
    messages.push(...checkMemoryCompatibility(components));
    messages.push(...checkCaseMotherboardCompatibility(components));
    messages.push(...checkCasePowerSupplyCompatibility(components));
    messages.push(...checkCaseStorageCompatibility(components));
    messages.push(...checkBottleneck(components));

    if (!messages.length) {
      messages.push({
        message: "All of your parts are compatible",
        severity: "success",
      });
    }

    messages.sort((a, b) => {
      if (a.severity === "error") {
        return -1;
      } else if (b.severity === "error") {
        return 1;
      } else if (a.severity === "warn") {
        return -1;
      } else if (b.severity === "warn") {
        return 1;
      } else {
        return 0;
      }
    });

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
