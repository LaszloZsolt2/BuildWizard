import { partModels } from "./partModels";

export type PartType =
  | "cpu-coolers"
  | "hard-drives"
  | "memories"
  | "cpus"
  | "gpus"
  | "cases"
  | "case-fans"
  | "motherboards"
  | "power-supplies";

export const partLabels = {
  "cpu-coolers": "CPU Cooler",
  "hard-drives": "Storage",
  memories: "Memory",
  cpus: "CPU",
  gpus: "GPU",
  cases: "Case",
  "case-fans": "Case Fan",
  motherboards: "Motherboard",
  "power-supplies": "Power Supply",
};
