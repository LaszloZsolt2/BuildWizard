import { PartType } from "../types/partType";

type ComponentQuantity = {
  [key in PartType]: "single" | "multiple";
};

export const componentQuantity: ComponentQuantity = {
  "cpu-coolers": "single",
  "hard-drives": "multiple",
  memories: "multiple",
  cpus: "single",
  gpus: "single",
  cases: "single",
  "case-fans": "multiple",
  motherboards: "single",
  "power-supplies": "single",
};
