import express from "express";
import { getPartList } from "../utils/partData";
import { ComponentsType } from "../types/componentsType";
import {
  checkBottleneck,
  checkCaseMotherboardCompatibility,
  checkCasePowerSupplyCompatibility,
  checkCaseStorageCompatibility,
  checkCpuCoolerCompatibilty,
  checkCpuMotherboardCompatibility,
  checkMemoryCompatibility,
  checkMotherboardMemoryCompatibility,
  hasAllNecessaryParts,
} from "../utils/compatibilityChecks";
import { getBuildPrice, getPowerConsumption } from "../utils/pcBuilder";
import { PartType } from "../types/partType";

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
      res.json({
        messages,
        price: { price: 0, isPriceForAllParts: false },
        powerConsumption: 0,
      });
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
    messages.push(...checkCpuCoolerCompatibilty(components));

    const price = getBuildPrice(components);
    let powerConsumption = 0;
    for (const t of Object.keys(components)) {
      const type = t as PartType;
      powerConsumption += getPowerConsumption(components[type], type);
    }

    if (components["power-supplies"]) {
      if (powerConsumption > components["power-supplies"].wattage) {
        messages.push({
          message: `Your power supply does not have enough wattage to power all of your components. Choose a power supply with at least ${powerConsumption} W.`,
          severity: "error",
        });
      } else if (
        powerConsumption * 1.3 >
        components["power-supplies"].wattage
      ) {
        messages.push({
          message: `Your power supply is barely enough to power all of your components. Consider adding a more powerful power supply (${powerConsumption * 1.5} W recommended).`,
          severity: "warn",
        });
      }
    }

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

    res.json({ messages, price, powerConsumption });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
