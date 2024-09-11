import express from "express";
import { getCombinedSystemRequirements } from "../utils/benchmark";
import { getAllParts, getPartList } from "../utils/partData";
import {
  buildPc,
  buildWithExtraBudget,
  getBuildPrice as getBuildPrice,
} from "../utils/pcBuilder";
import { ComponentsType } from "../types/componentsType";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [systemRequirements, allParts, requiredParts] = await Promise.all([
      getCombinedSystemRequirements(req),
      getAllParts(),
      getPartList(req.query.components as ComponentsType),
    ]);

    if (!systemRequirements) {
      res.status(400).json({ message: "System requirements not found" });
      return;
    }

    const minRequirementsPc = buildPc(
      systemRequirements,
      allParts,
      requiredParts || {},
      {
        systemRequirements: "minimum",
      }
    );

    let recRequirementsPc = buildPc(
      systemRequirements,
      allParts,
      requiredParts || {},
      {
        systemRequirements: "recommended",
      }
    );

    const budget = req.query.budget as unknown as number;

    if (
      (!minRequirementsPc && !recRequirementsPc) ||
      getBuildPrice(minRequirementsPc).price > budget
    ) {
      res.json({
        message:
          "Could not build a PC matching this criteria. Try increasing your budget or removing some selected parts.",
      });
      return;
    }

    if (budget) {
      const buildType =
        recRequirementsPc && getBuildPrice(recRequirementsPc).price <= budget
          ? "recommended"
          : "minimum";

      let multiplier = 1;
      let increment = 1;

      let maxPerformancePc =
        buildType === "recommended" ? recRequirementsPc : minRequirementsPc;

      if (getBuildPrice(maxPerformancePc!).price > budget) {
        maxPerformancePc = null;
      }

      while (true) {
        const newPc = buildPc(
          systemRequirements,
          allParts,
          requiredParts || {},
          {
            systemRequirements: buildType,
          },
          multiplier + increment
        );

        if (newPc && getBuildPrice(newPc).price <= budget) {
          multiplier += increment;
          maxPerformancePc = newPc;
        } else {
          increment /= 2;
          if (increment < 0.05) {
            break;
          }
        }
      }

      if (maxPerformancePc) {
        maxPerformancePc = buildWithExtraBudget(
          budget,
          maxPerformancePc,
          multiplier,
          systemRequirements,
          allParts,
          requiredParts || {},
          buildType
        );
      }

      multiplier **= 0.8;

      let balancedPc = buildPc(
        systemRequirements,
        allParts,
        requiredParts || {},
        {
          systemRequirements: buildType,
        },
        multiplier
      );

      if (balancedPc) {
        balancedPc = buildWithExtraBudget(
          budget,
          balancedPc,
          multiplier,
          systemRequirements,
          allParts,
          requiredParts || {},
          buildType
        );

        if (
          getBuildPrice(balancedPc).price ===
          getBuildPrice(maxPerformancePc).price
        ) {
          balancedPc = null;
        }
      }

      multiplier **= 0.8;

      let premiumPc = buildPc(
        systemRequirements,
        allParts,
        requiredParts || {},
        {
          systemRequirements: buildType,
        },
        multiplier
      );

      if (premiumPc) {
        premiumPc = buildWithExtraBudget(
          budget,
          premiumPc,
          multiplier,
          systemRequirements,
          allParts,
          requiredParts || {},
          buildType
        );

        if (
          getBuildPrice(premiumPc).price === getBuildPrice(balancedPc).price ||
          getBuildPrice(premiumPc).price ===
            getBuildPrice(maxPerformancePc).price
        ) {
          premiumPc = null;
        }
      }

      res.json({
        builds: {
          maxPerformance: maxPerformancePc && {
            build: maxPerformancePc,
            price: getBuildPrice(maxPerformancePc!),
            type: buildType,
          },
          balanced: balancedPc && {
            build: balancedPc,
            price: getBuildPrice(balancedPc!),
            type: buildType,
          },
          premium: premiumPc && {
            build: premiumPc,
            price: getBuildPrice(premiumPc!),
            type: buildType,
          },
        },
      });
    } else {
      let premiumPc;

      if (recRequirementsPc) {
        premiumPc = buildPc(
          systemRequirements,
          allParts,
          requiredParts || {},
          {
            systemRequirements: "recommended",
          },
          1.5
        );

        if (premiumPc) {
          premiumPc = buildWithExtraBudget(
            getBuildPrice(premiumPc).price * 1.1,
            premiumPc,
            1.5,
            systemRequirements,
            allParts,
            requiredParts || {},
            "recommended"
          );
        }

        if (
          getBuildPrice(premiumPc).price ===
            getBuildPrice(recRequirementsPc).price ||
          getBuildPrice(premiumPc).price ===
            getBuildPrice(minRequirementsPc).price
        ) {
          premiumPc = null;
        }
      }

      if (
        getBuildPrice(minRequirementsPc).price ===
        getBuildPrice(recRequirementsPc).price
      ) {
        recRequirementsPc = null;
      }

      res.json({
        builds: {
          minimum: minRequirementsPc && {
            build: minRequirementsPc,
            price: getBuildPrice(minRequirementsPc!),
            type: "minimum",
          },
          recommended: recRequirementsPc && {
            build: recRequirementsPc,
            price: getBuildPrice(recRequirementsPc!),
            type: "recommended",
          },
          recPremium: premiumPc && {
            build: premiumPc,
            price: getBuildPrice(premiumPc),
            type: "recommended",
          },
        },
      });
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
